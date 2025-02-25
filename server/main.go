package main

import (
	"context"
	"languageNotes/handlers"
	"languageNotes/middlewares"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"go.uber.org/zap"
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

	if os.Getenv("AUTH_SIGN_KEY") == "" {
		log.Fatal("env var AUTH_SIGN_KEY is missing.")
	}

	if os.Getenv("LOG_ENV") != "develop" && os.Getenv("LOG_ENV") != "prod" {
		log.Fatal("env var LOG_ENV is not develop or prod.")
	}

	// Set global logger
	var logger *zap.Logger
	if os.Getenv("LOG_ENV") == "develop" {
		logger = zap.Must(zap.NewDevelopment())
	} else if os.Getenv("LOG_ENV") == "prod" {
		logger = zap.Must(zap.NewProduction())
	}

	zap.ReplaceGlobals(logger)

	defer logger.Sync()
}

func main() {
	// Logger initiation
	mux := http.NewServeMux()

	connPool := createDbConnection()
	defer connPool.Close()

	// Register routes
	mux.HandleFunc("GET /health", handlers.NewHealthCheckHandler().Ping)

	mux.HandleFunc("POST /translate", handlers.NewTranslationHandler(connPool).PostTranslate)
	mux.HandleFunc("POST /set", handlers.NewSetHandler(connPool).PostSet)
	mux.HandleFunc("POST /page", handlers.NewPageHandler(connPool).PostPage)
	mux.HandleFunc("POST /book", handlers.NewBookHandler(connPool).PostBook)

	mux.HandleFunc("GET /set/{setID}/translation-cards", handlers.NewTranslationHandler(connPool).GetTranslationCards)
	mux.HandleFunc("GET /page/{pageID}/sets", handlers.NewPageHandler(connPool).GetAllSets)
	mux.HandleFunc("GET /book/{bookID}/pages", handlers.NewBookHandler(connPool).GetAllPages)
	mux.HandleFunc("GET /book", handlers.NewBookHandler(connPool).GetAllBooks)
	mux.HandleFunc("PATCH /translation-card/{cardID}", handlers.NewTranslationHandler(connPool).PatchTranslationCard)

	mux.HandleFunc("DELETE /translation-card/{cardID}", handlers.NewTranslationHandler(connPool).DeleteTranslationCard)
	mux.HandleFunc("DELETE /page/{pageID}", handlers.NewPageHandler(connPool).DeletePage)
	mux.HandleFunc("DELETE /set/{setID}", handlers.NewSetHandler(connPool).DeleteSet)

	// Middlewares active
	middlewaresList := []middlewares.Middleware{
		middlewares.RequestID(),
		middlewares.UserJwtAuthentication([]byte(os.Getenv("AUTH_SIGN_KEY"))),
	}

	wrappedMux := middlewares.ApplyMiddleware(mux, middlewaresList...)

	corsOptions := cors.Options{
		AllowCredentials: true,
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowedMethods:   []string{"GET", "POST", "PATCH", "DELETE"},
	}

	corsEnabled := cors.New(corsOptions).Handler(wrappedMux)

	server := &http.Server{
		Addr:    ":8080",
		Handler: corsEnabled,
	}

	zap.L().Info("Server started")
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
