package server

import (
	"back/internal/database" // Importa el paquete database
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func (s *Server) clothesHandler(c *gin.Context) {
	filter := bson.D{}
	count, err := s.db.CountDocuments(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	resp := make(map[string]interface{})
	resp["message"] = "Hello Clothes"
	resp["count"] = count
	c.JSON(http.StatusOK, resp)
}

func (s *Server) insertClothes(c *gin.Context) {
	var newClothes []database.Clothing // Usa un slice de Restaurant del paquete database

	// Call BindJSON to bind the received JSON to newRestaurants.
	if err := c.BindJSON(&newClothes); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Aquí puedes insertar los nuevos restaurantes en la base de datos
	insertedIDs, err := s.db.InsertClothes(newClothes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"inserted_ids": insertedIDs})
}
