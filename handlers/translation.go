package handlers

import (
	"encoding/json"
	"languageNotes/service"
	"net/http"
)

type TranslationHandler struct {
}

type postTranslationRequestBody struct {
	English         string `json:"english"`
	DesiredLanguage string `json:"language"`
}

func NewTranslationHandler() *TranslationHandler {
	return &TranslationHandler{}
}

func (h *TranslationHandler) PostTranslate(w http.ResponseWriter, r *http.Request) {
	var reqBody *postTranslationRequestBody

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// TODO: Validate request

	s := service.NewTranslationService()

	res, err := s.TranslateEnglishToLanguage(reqBody.English, reqBody.DesiredLanguage)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
