package utils

import (
	"log"
	"os"
)

var (
	InfoLogger  *log.Logger
	ErrorLogger *log.Logger
	Logger      *CustomLogger
)

type CustomLogger struct {
	info  *log.Logger
	error *log.Logger
}

func (l *CustomLogger) Info(msg string) {
	l.info.Println(msg)
}

func (l *CustomLogger) Error(msg string) {
	l.error.Println(msg)
}

func InitLogger() {
	file, err := os.OpenFile("server.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal("Could not open log file : ", err)
	}

	InfoLogger = log.New(file, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	ErrorLogger = log.New(file, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
	
	// Initialize the Logger instance
	Logger = &CustomLogger{
		info:  InfoLogger,
		error: ErrorLogger,
	}
}