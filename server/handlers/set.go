package handlers

import (
	"encoding/json"
	"languageNotes/service"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

type SetHandler struct {
	conn *pgxpool.Pool
}

type PostSetRequestBody struct {
	Name   string `json:"name"`
	PageID int64  `json:"pageId"`
}

func NewSetHandler(p *pgxpool.Pool) *SetHandler {
	return &SetHandler{conn: p}
}

// Create a new Set
func (h *SetHandler) PostSet(w http.ResponseWriter, r *http.Request) {
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
		"PostSet",
		zap.String("uuid", uuid),
	)

	var reqBody *PostSetRequestBody

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	// TODO: Validate the request

	s := service.NewSetService(h.conn, r.Context(), logger)

	if err := s.CreateNewSet(uuid, reqBody.Name, reqBody.PageID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
