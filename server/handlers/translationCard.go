package handlers

import (
	"encoding/json"
	"languageNotes/service"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
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
		"PostTranslate",
		zap.String("uuid", uuid),
	)

	var reqBody *postTranslationRequestBody

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// TODO: Validate request

	s := service.NewTranslationService(h.conn, r.Context(), logger)

	err = s.CreateNewTranslationCard(uuid, reqBody.English, reqBody.Language)

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
		"GetTranslationCards",
		zap.String("uuid", uuid),
	)

	// Retrieve values from the path
	setID, err := strconv.Atoi(r.PathValue("setId"))

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// TODO: Validate request

	// Create new service and call the relevant method
	s := service.NewTranslationService(h.conn, r.Context(), logger)

	res, err := s.RetrieveTransactionCards(uuid, setID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
