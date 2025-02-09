package server

import (
	"back/internal/handlers"
	"back/internal/middleware"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200"}, // Add your frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true, // Enable cookies/auth
	}))

	r.GET("/", s.HelloWorldHandler)
	r.GET("/clothes", s.getClothes)
	r.GET("/cloth/:id", s.getCloth)
	r.GET("/health", s.healthHandler)
	r.POST("/register", handlers.RegisterHandler(s.db))
	r.POST("/login", handlers.LoginHandler(s.db))
	r.GET("/logout", handlers.LogoutHandler)

	authorized := r.Group("/", middleware.AuthMiddleware())
	authorized.POST("/clothes", s.insertClothing)

	userinfo := r.Group("/userinfo", middleware.AuthMiddleware())
	userinfo.GET("/published", handlers.GetPublished(s.db))
	return r
}

func (s *Server) HelloWorldHandler(c *gin.Context) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	c.JSON(http.StatusOK, resp)
}

func (s *Server) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, s.db.Health())
}
