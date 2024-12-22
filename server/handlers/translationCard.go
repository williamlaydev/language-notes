package handlers

import (
	"encoding/json"
	"languageNotes/service"
	"log"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
)

type TranslationHandler struct {
	conn *pgxpool.Pool
}

type postTranslationRequestBody struct {
	English  string `json:"english"`
	Language string `json:"language"`
}

func NewTranslationHandler(p *pgxpool.Pool) *TranslationHandler {
	return &TranslationHandler{conn: p}
}

// POST /translate
//
//	request: {
//		english: string
//		language: string
//	}
//
// response: No body only 200
// This API will translate an English version of a word to the desired language, then it will add the
// respective data to the database
func (h *TranslationHandler) PostTranslate(w http.ResponseWriter, r *http.Request) {
	log.Print("Create new card")
	var reqBody *postTranslationRequestBody

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// TODO: Authenticate user

	// TODO: Validate request

	s := service.NewTranslationService(h.conn, r.Context())

	err := s.CreateNewTranslationCard(reqBody.English, reqBody.Language)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	// TODO: Maybe add a return body so that we know what was added?
}

// GET /set/{setId}/translation-cards
func (h *TranslationHandler) GetTranslationCards(w http.ResponseWriter, r *http.Request) {
	log.Print("Get Translation Cards")
	setId, err := strconv.Atoi(r.PathValue("setId"))

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// TODO: Authenticate user

	// TODO: Validate request

	s := service.NewTranslationService(h.conn, r.Context())

	res, err := s.RetrieveTransactionCards("f47c1a1b-2e71-4960-878d-cd70db13264e", setId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
