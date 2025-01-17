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
    coll := s.db.Database("sample_mflix").Collection("movies")
    count, err := coll.CountDocuments(context.Background(), filter)
    if err != nil {
        return 0, err
    }
    return count, nil
}