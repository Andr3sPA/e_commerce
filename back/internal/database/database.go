package database

import (
	"context"
	"log"
	"os"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Service interface {
	Health() map[string]string
	CountDocuments(filter bson.D) (int64, error)
	InsertClothes(restaurants []Clothing) ([]interface{}, error)
}

type service struct {
	db *mongo.Client
}

func New() Service {
	uri := os.Getenv("BLUEPRINT_DB_URI")

	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	return &service{
		db: client,
	}
}

func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	err := s.db.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("db down: %v", err)
	}

	return map[string]string{
		"message": "It's healthy",
	}
}

func (s *service) CountDocuments(filter bson.D) (int64, error) {
	coll := s.db.Database("e_commerce").Collection("clothes")
	count, err := coll.CountDocuments(context.Background(), filter)
	if err != nil {
		return 0, err
	}
	return count, nil
}

type Clothing struct {
    Name        string  `bson:"name,omitempty"`         
    Size        string  `bson:"size,omitempty"`         
    Color       string  `bson:"color,omitempty"`        
    Price       float64 `bson:"price,omitempty"`     
    Material    string  `bson:"material,omitempty"`     
    Description string  `bson:"description,omitempty"`  
}


func (s *service) InsertClothes(clothes []Clothing) ([]interface{}, error) {
	coll := s.db.Database("e_commerce").Collection("clothes")

	var docs []interface{}
	for _, item := range clothes {
		docs = append(docs, item)
	}

	result, err := coll.InsertMany(context.TODO(), docs)
	if err != nil {
		return nil, err
	}

	return result.InsertedIDs, nil
}
