package server

import (
	"back/internal/database" // Importa el paquete database
	"fmt"
	"net/http"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func (s *Server) getClothes(c *gin.Context) {
	filter := bson.D{}
	clothes, err := s.db.GetClothes(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, clothes)
}

func (s *Server) getCloth(c *gin.Context) {
	id, exists := c.Params.Get("id")
	if !exists {
		c.JSON(http.StatusBadRequest, nil)
		return
	}

	cloth, err := s.db.GetCloth(id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, nil)
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, cloth)
}

func (s *Server) insertClothing(c *gin.Context) {
	// Handle image upload
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	files := form.File["image"]
	if len(files) != 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "exactly one image is required"})
		return
	}

	file, err := files[0].Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer file.Close()
	cld, ctx, err := s.db.Credentials()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	resp, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		PublicID:       files[0].Filename,
		UniqueFilename: api.Bool(true),
		Overwrite:      api.Bool(false),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Errorf("error uploading image: %w", err).Error()})
		return
	}
	// Create a new Clothing instance and populate it with form data
	var newClothing database.Clothing
	newClothing.Name = form.Value["name"][0]
	newClothing.Reference = form.Value["reference"][0]
	newClothing.Size = form.Value["size"][0]
	newClothing.Color = form.Value["color"][0]
	newClothing.Material = form.Value["material"][0]
	newClothing.Description = form.Value["description"][0]

	username, _ := c.Get("username")
	user, _ := s.db.FindUserByUsername(username.(string))

	newClothing.PublisherID = user.Id
	newClothing.Status = database.InStock

	price, err := strconv.ParseFloat(form.Value["price"][0], 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid price"})
		return
	}
	newClothing.Price = price
	// Add the imageID to the Images field of newClothing
	newClothing.Images = append(newClothing.Images, resp.URL)

	// Insert clothing into the database
	insertedID, err := s.db.InsertClothing(newClothing)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"inserted_id": insertedID})
}
