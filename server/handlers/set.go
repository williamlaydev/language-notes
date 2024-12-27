package handlers

import (
	"encoding/json"
	"languageNotes/service"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
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
	log.Print("Create new Set")

	var reqBody *PostSetRequestBody

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	// TODO: Validate the request
	// TODO: Fix userID

	s := service.NewSetService(h.conn, r.Context())

	if err := s.CreateNewSet(reqBody.Name, reqBody.PageID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
