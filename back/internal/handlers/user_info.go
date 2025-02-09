package handlers

import (
	"back/internal/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetPublished(s database.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("username")
		if !exists {
			c.Status(http.StatusForbidden)
			return
		}

		clothings, error := s.GetPublishedByUsername(user.(string))
		if error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": error.Error()})
			return
		}

		c.JSON(http.StatusOK, clothings)
	}
}
