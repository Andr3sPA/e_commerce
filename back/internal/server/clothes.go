package server

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
)

func (s *Server) clothesHandler(c *gin.Context) {
    filter := bson.D{{"year", 1916}}
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