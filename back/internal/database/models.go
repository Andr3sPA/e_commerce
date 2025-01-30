package database

type User struct {
	Username string `bson:"username,omitempty"`
	Password string `bson:"password,omitempty"`
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