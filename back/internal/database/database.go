package database

import (
    "context"
    "fmt"
    "io"
    "log"
    "mime/multipart"
    "os"
    "time"
    _ "github.com/joho/godotenv/autoload"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/gridfs"
    "go.mongodb.org/mongo-driver/mongo/options"
    "github.com/cloudinary/cloudinary-go/v2"

)

type Service interface {
    Health() map[string]string
    CountDocuments(filter bson.D) (int64, error)
    InsertClothing(clothing Clothing) (interface{}, error)
    UploadImage(file multipart.File, fileHeader *multipart.FileHeader) (string, error)
    Credentials() (*cloudinary.Cloudinary, context.Context, error)
    GetDocuments(filter bson.D) ([]Clothing, error)
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
func (s *service) GetDocuments(filter bson.D) ([]Clothing, error) {
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

type Clothing struct {
    Name        string   `bson:"name,omitempty"`
    Reference   string   `bson:"reference,omitempty"`
    Size        string   `bson:"size,omitempty"`
    Color       string   `bson:"color,omitempty"`
    Price       float64  `bson:"price,omitempty"`
    Material    string   `bson:"material,omitempty"`
    Description string   `bson:"description,omitempty"`
    Images      []string `bson:"images,omitempty"`
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

func (s *service) UploadImage(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
    bucket, err := gridfs.NewBucket(s.db.Database("e_commerce"))
    if err != nil {
        return "", fmt.Errorf("failed to create GridFS bucket: %w", err)
    }

    // Abre un stream para subir el archivo
    uploadStream, err := bucket.OpenUploadStream(fileHeader.Filename)
    if err != nil {
        return "", fmt.Errorf("failed to open upload stream: %w", err)
    }
    defer uploadStream.Close()

    // Copia los datos del archivo al stream de subida
    _, err = io.Copy(uploadStream, file)
    if err != nil {
        return "", fmt.Errorf("failed to copy file data to upload stream: %w", err)
    }

    // Convierte el FileID a string usando el método Hex()
    objectID, ok := uploadStream.FileID.(primitive.ObjectID)
    if !ok {
        return "", fmt.Errorf("failed to cast FileID to ObjectID")
    }

    return objectID.Hex(), nil
}