package handlers

import (
	"encoding/json"
	"languageNotes/service"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

type BookHandler struct {
	conn *pgxpool.Pool
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

	language := r.URL.Query().Get("language")

	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }

	// TODO: Validate request

	s := service.NewBookService(h.conn, r.Context(), logger)

	res, err := s.RetrievePagesForBook(uuid, language)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
