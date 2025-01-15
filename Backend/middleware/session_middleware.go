package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

var sessionStore = make(map[string]bool)

func SessionMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		sessionID, err := c.Cookie("session_id")
		if err != nil {
			// Belum ada cookie -> generate session ID baru
			sessionID = uuid.New().String()
			// Simpan di cookie
			c.SetCookie("session_id", sessionID,
				3600*24, // 1 day
				"/",
				"",
				false,
				true)
			sessionStore[sessionID] = true
		} else {
			// Sudah ada session
			if _, exists := sessionStore[sessionID]; !exists {
				// Session baru
				sessionStore[sessionID] = true
			}
		}
		c.Next()
	}
}
