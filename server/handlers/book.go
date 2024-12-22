package handlers

import (
	"encoding/json"
	"languageNotes/service"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

type BookHandler struct {
	conn *pgxpool.Pool
}

func NewBookHandler(p *pgxpool.Pool) *BookHandler {
	return &BookHandler{conn: p}
}

func (h *BookHandler) GetAllPages(w http.ResponseWriter, r *http.Request) {
	log.Print("Get All Pages")
	// TODO: MUST CHANGE THIS FROM PATH VALUEUSER ID
	userId := r.PathValue("userId")
	language := r.URL.Query().Get("language")

	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }
	// TODO: Authenticate user

	// TODO: Validate request

	s := service.NewBookService(h.conn, r.Context())

	res, err := s.RetrievePagesForBook(userId, language)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
