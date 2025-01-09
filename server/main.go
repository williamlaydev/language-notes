package main

import (
	"context"
	"languageNotes/handlers"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("error loading env file: %s", err)
	}

	if os.Getenv("OPEN_AI_KEY") == "" {
		log.Fatal("env var OPEN_AI_KEY is missing.")
	}

	if os.Getenv("DATABASE_URL") == "" {
		log.Fatal("env var DATABASE_URL is missing.")
	}
}

func main() {
	mux := http.NewServeMux()

	connPool := createDbConnection()
	defer connPool.Close()

	corsEnabled := cors.Default().Handler(mux)
	server := &http.Server{
		Addr:    ":8080",
		Handler: corsEnabled,
	}

	mux.HandleFunc("POST /translate", handlers.NewTranslationHandler(connPool).PostTranslate)
	mux.HandleFunc("POST /set", handlers.NewSetHandler(connPool).PostSet)
	mux.HandleFunc("POST /page", handlers.NewPageHandler(connPool).PostPage)
	mux.HandleFunc("GET /set/{setId}/translation-cards", handlers.NewTranslationHandler(connPool).GetTranslationCards)
	mux.HandleFunc("GET /page/{pageId}/sets", handlers.NewPageHandler(connPool).GetAllSets)
	mux.HandleFunc("GET /book/{userId}/pages", handlers.NewBookHandler(connPool).GetAllPages)
	log.Print("Server started")
	if err := server.ListenAndServe(); err != nil || err != http.ErrServerClosed {
		log.Fatalf("Server failed: %v", err)
	}
}
func createDbConnection() *pgxpool.Pool {
	config, err := pgxpool.ParseConfig(os.Getenv("DATABASE_URL"))
	config.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeExec
	if err != nil {
		log.Fatalf("Failed to parse database config: %v", err)
	}

	conn, err := pgxpool.NewWithConfig(context.Background(), config)

	if err != nil {
		log.Fatalf("Failed to create connection pool: %v", err)
	}

	if err := conn.Ping(context.Background()); err != nil {
		log.Fatalf("Database failed to connect: %v", err)
	}
	return conn
}
