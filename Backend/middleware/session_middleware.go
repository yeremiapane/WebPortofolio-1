package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"sync"
	"time"
)

var (
	sessionStore sync.Map // Menggunakan sync.Map untuk keamanan concurrent
	once         sync.Once
)

// SessionDuration adalah durasi sesi berlaku (30 hari)
const SessionDuration = 30 * 24 * time.Hour

// CleanupInterval adalah interval untuk membersihkan sesi kadaluarsa (misalnya setiap 24 jam)
const CleanupInterval = 24 * time.Hour

// startSessionCleanup memulai goroutine untuk membersihkan sesi yang kadaluarsa
func startSessionCleanup() {
	ticker := time.NewTicker(CleanupInterval)
	go func() {
		for {
			select {
			case <-ticker.C:
				now := time.Now()
				sessionStore.Range(func(key, value interface{}) bool {
					_, ok1 := key.(string)
					sessionTime, ok2 := value.(time.Time)
					if !ok1 || !ok2 {
						// Tipe data tidak valid, hapus entry
						sessionStore.Delete(key)
						return true
					}
					if now.Sub(sessionTime) > SessionDuration {
						// Sesi kadaluarsa, hapus
						sessionStore.Delete(key)
					}
					return true
				})
			}
		}
	}()
}

// SessionMiddleware mengelola sesi pengguna berdasarkan session_id di cookie
func SessionMiddleware() gin.HandlerFunc {
	// Pastikan pembersihan sesi dimulai hanya sekali
	once.Do(startSessionCleanup)

	return func(c *gin.Context) {
		sessionID, err := c.Cookie("session_id")
		if err != nil || sessionID == "" {
			// Belum ada cookie -> generate session ID baru
			sessionID = uuid.New().String()
			// Simpan di cookie dengan masa berlaku 30 hari
			c.SetCookie("session_id", sessionID,
				3600*24*30, // 30 days
				"/",
				"",
				false,
				true)
			// Simpan sesi dengan waktu pembuatan
			sessionStore.Store(sessionID, time.Now())
		} else {
			// Sudah ada session
			if _, exists := sessionStore.Load(sessionID); !exists {
				// Session baru, simpan dengan waktu pembuatan
				sessionStore.Store(sessionID, time.Now())
			} else {
				// Opsional: Update waktu akses terakhir jika diperlukan
				sessionStore.Store(sessionID, time.Now())
			}
		}
		c.Next()
	}
}
