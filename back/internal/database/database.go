package database

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	_ "github.com/joho/godotenv/autoload"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Service interface {
	Health() map[string]string
	InsertClothing(clothing Clothing) (interface{}, error)
	InsertUser(user User) (interface{}, error)
	FindUserByUsername(username string) (User, error)
	GetClothes(filter bson.D) ([]Clothing, error)
	GetCloth(id string) (Clothing, error)
	Credentials() (*cloudinary.Cloudinary, context.Context, error)
	GetPublishedByUsername(username string) ([]Clothing, error)
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

func (s *service) GetClothes(filter bson.D) ([]Clothing, error) {
	coll := s.db.Database("e_commerce").Collection("clothes")
	cursor, err := coll.Find(context.TODO(), filter)
	if err != nil {
		return []Clothing{}, err
	}
	// Unpacks the cursor into a slice
	var results []Clothing
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}
	return results, nil
}

func (s *service) GetCloth(id string) (Clothing, error) {
	var res Clothing
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return res, err
	}
	filter := bson.M{"_id": oid}
	err = s.db.Database("e_commerce").Collection("clothes").FindOne(context.TODO(), filter).Decode(&res)
	return res, err
}

func (s *service) Credentials() (*cloudinary.Cloudinary, context.Context, error) {
	// Obtén la URL de Cloudinary desde las variables de entorno
	cloudinaryURL := os.Getenv("CLOUDINARY_URL")
	if cloudinaryURL == "" {
		return nil, nil, fmt.Errorf("CLOUDINARY_URL no está configurada")
	}

	// Crea una nueva instancia de Cloudinary
	cld, err := cloudinary.NewFromURL(cloudinaryURL)
	if err != nil {
		return nil, nil, fmt.Errorf("error al crear instancia de Cloudinary: %w", err)
	}

	// Configura la URL para que sea segura (https)
	cld.Config.URL.Secure = true

	// Crea un contexto
	ctx := context.Background()

	return cld, ctx, nil
}

func (s *service) InsertClothing(clothing Clothing) (interface{}, error) {
	coll := s.db.Database("e_commerce").Collection("clothes")

	result, err := coll.InsertOne(context.TODO(), clothing)
	if err != nil {
		return nil, err
	}

	return result.InsertedID, nil
}

func (s *service) InsertUser(user User) (interface{}, error) {
	coll := s.db.Database("e_commerce").Collection("users")

	// Verifica si el usuario ya existe
	var existing User
	err := coll.FindOne(context.Background(), bson.M{"username": user.Username}).Decode(&existing)
	if err == nil {
		return nil, errors.New("el usuario ya existe")
	}

	// Inserta el nuevo usuario
	result, err := coll.InsertOne(context.Background(), user)
	if err != nil {
		return nil, err
	}

	return result.InsertedID, nil
}

func (s *service) FindUserByUsername(username string) (User, error) {
	coll := s.db.Database("e_commerce").Collection("users")

	var user User
	err := coll.FindOne(context.Background(), bson.M{"username": username}).Decode(&user)
	if err != nil {
		return User{}, err
	}

	return user, nil
}

func (s *service) GetPublishedByUsername(username string) ([]Clothing, error) {
	coll := s.db.Database("e_commerce").Collection("clothes")

	user, err := s.FindUserByUsername(username)
	if err != nil {
		return nil, err
	}

	cursor, err := coll.Find(context.Background(), bson.M{"publisher_id": user.Id})
	if err != nil {
		return nil, err
	}

	var clothes []Clothing
	if err = cursor.All(context.TODO(), &clothes); err != nil {
		return nil, err
	}

	return clothes, nil
}
