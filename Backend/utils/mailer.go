package utils

import (
	"fmt"
	"net/smtp"
	"os"
	"strconv"
)

// SendEmail: kirim email notifikasi
func SendEmail(subject, body string) error {
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")
	adminEmail := os.Getenv("NOTIF_ADMIN")

	port, _ := strconv.Atoi(smtpPort)

	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)

	// Construct message
	msg := []byte(
		"To: " + adminEmail + "\r\n" +
			"Subject: " + subject + "\r\n" +
			"MIME-Version: 1.0\r\n" +
			"Content-Type: text/plain; charset=\"utf-8\"\r\n" +
			"\r\n" +
			body + "\r\n")

	addr := fmt.Sprintf("%s:%d", smtpHost, port)

	err := smtp.SendMail(addr, auth, smtpUser, []string{adminEmail}, msg)
	return err
}
