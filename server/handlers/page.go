package handlers

import (
	"encoding/json"
	"languageNotes/service"
	"log"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
)

type PageHandler struct {
	conn *pgxpool.Pool
}

func NewPageHandler(p *pgxpool.Pool) *PageHandler {
	return &PageHandler{conn: p}
}

// GET /page/{pageId}/sets
func (h *PageHandler) GetAllSets(w http.ResponseWriter, r *http.Request) {
	log.Print("Get all sets")
	pageId, err := strconv.Atoi(r.PathValue("pageId"))

	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// TODO: Authenticate user

	// TODO: Validate request

	s := service.NewPageService(h.conn, r.Context())

	res, err := s.RetrieveSetsForPage("f47c1a1b-2e71-4960-878d-cd70db13264e", pageId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
