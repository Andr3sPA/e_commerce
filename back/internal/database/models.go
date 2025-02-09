package database

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	Id       primitive.ObjectID `bson:"_id,omitempty"`
	Username string             `bson:"username,omitempty"`
	Password string             `bson:"password,omitempty"`
}

type ClothingStatus int

const (
	InStock ClothingStatus = 0
	Sold    ClothingStatus = 1
)

type Clothing struct {
	Id          primitive.ObjectID `bson:"_id,omitempty"`
	PublisherID primitive.ObjectID `bson:"publisher_id" json:"-"`
	Name        string             `bson:"name,omitempty"`
	Reference   string             `bson:"reference,omitempty"`
	Size        string             `bson:"size,omitempty"`
	Color       string             `bson:"color,omitempty"`
	Price       float64            `bson:"price,omitempty"`
	Material    string             `bson:"material,omitempty"`
	Description string             `bson:"description,omitempty"`
	Images      []string           `bson:"images,omitempty"`
	Status      ClothingStatus     `bson:"status"`
}
