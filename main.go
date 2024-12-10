package main

import (
	"languageNotes/handlers"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("error loading env file: %s", err)
	}

	if os.Getenv("OPEN_AI_KEY") == "" {
		log.Fatal("env var OPEN_AI_KEY is missing.")
	}
}

func main() {
	mux := http.NewServeMux()

	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	mux.HandleFunc("POST /translate", handlers.NewTranslationHandler().PostTranslate)

	log.Print("Server started")
	if err := server.ListenAndServe(); err != nil || err != http.ErrServerClosed {
		log.Fatalf("Server failed: %v", err)
	}

}
