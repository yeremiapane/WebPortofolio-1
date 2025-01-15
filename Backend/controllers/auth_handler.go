package controllers

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/yeremiapane/WebPortofolio-1/Backend/config"
	"github.com/yeremiapane/WebPortofolio-1/Backend/models"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
	"time"
)

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func GenerateJWT(userID uint) (string, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", errors.New("no JWT secret")
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), //expired 24 jam
	})

	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password_hash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusOK, gin.H{"error": "Invalid Credentials"})
		return
	}
	tokenString, err := GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

func Logout(c *gin.Context) {
	cookieName := "jwt"
	// Atur cookie dengan nilai kosong dan expired time di masa lalu
	c.SetCookie(cookieName, "", -1, "/", "domainanda.com", true, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
