package handlers

import (
	"encoding/json"
	"languageNotes/service"
	"net/http"
	"slices"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

type BookHandler struct {
	conn *pgxpool.Pool
}

type PostBookRequestBody struct {
	Name     string `json:"name"`
	Language string `json:"language"`
}

func NewBookHandler(p *pgxpool.Pool) *BookHandler {
	return &BookHandler{conn: p}
}

func (h *BookHandler) GetAllPages(w http.ResponseWriter, r *http.Request) {
	// Create a logger
	logger, err := createLoggerForRequest(r)

	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Retrieve UUID from context
	uuid, err := retrieveUUIDfromContext(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Entry log
	logger.Info(
		"GetAllPages",
		zap.String("uuid", uuid),
	)

	bookID, err := strconv.Atoi(r.PathValue("bookID"))

	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }

	// TODO: Validate request

	s := service.NewBookService(h.conn, r.Context(), logger)

	res, err := s.RetrievePagesForBook(uuid, bookID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func (h *BookHandler) GetAllBooks(w http.ResponseWriter, r *http.Request) {
	// Create a logger
	logger, err := createLoggerForRequest(r)

	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Retrieve UUID from context
	uuid, err := retrieveUUIDfromContext(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Entry log
	logger.Info(
		"GetAllBooks",
		zap.String("uuid", uuid),
	)

	s := service.NewBookService(h.conn, r.Context(), logger)

	res, err := s.RetrieveAllBooks(uuid)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func (h *BookHandler) PostBook(w http.ResponseWriter, r *http.Request) {
	logger, err := createLoggerForRequest(r)

	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Retrieve UUID from context
	uuid, err := retrieveUUIDfromContext(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Entry log
	logger.Info(
		"PostBook",
		zap.String("uuid", uuid),
	)

	var reqBody *PostBookRequestBody
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Validate request
	if len(reqBody.Name) <= 0 || len(reqBody.Name) > 12 {
		http.Error(w, "Invalid book name", http.StatusBadRequest)
		return
	}

	languageList := []string{"Chinese", "Japanese", "Korean"}

	if !slices.Contains(languageList, reqBody.Language) {
		http.Error(w, "Invalid language", http.StatusBadRequest)
		return
	}

	s := service.NewBookService(h.conn, r.Context(), logger)
	newBook, err := s.CreateNewBook(uuid, reqBody.Name, reqBody.Language)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newBook)
}
