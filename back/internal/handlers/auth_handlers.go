package handlers

import (
	"back/internal/database"
	"back/internal/jwt"
	"back/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterHandler(s database.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
			return
		}

		hashedPassword, err := utils.HashPassword(req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar contraseña"})
			return
		}

		user := database.User{Username: req.Username, Password: hashedPassword}
		_, err = s.InsertUser(user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Usuario registrado con éxito"})
	}
}

func LoginHandler(s database.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
			return
		}

		user, err := s.FindUserByUsername(req.Username)
		if err != nil || !utils.CheckPasswordHash(req.Password, user.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
			return
		}

		token, err := jwt.GenerateToken(user.Username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar token"})
			return
		}

		c.SetCookie("session_token", token, 3600, "/", "localhost", false, true)
		c.JSON(http.StatusOK, gin.H{"message": "Inicio de sesión exitoso"})
	}
}

func LogoutHandler(c *gin.Context) {
	c.SetCookie("session_token", "", -1, "/", "", false, true)
	c.Status(http.StatusOK)
}
