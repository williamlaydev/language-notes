package handlers

import (
	"encoding/json"
	"languageNotes/service"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

type PageHandler struct {
	conn *pgxpool.Pool
}

type PostPageRequestBody struct {
	Name   string `json:"name"`
	BookID int64  `json:"bookId"`
}

func NewPageHandler(p *pgxpool.Pool) *PageHandler {
	return &PageHandler{conn: p}
}

// GET /page/{pageId}/sets
func (h *PageHandler) GetAllSets(w http.ResponseWriter, r *http.Request) {
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
		"GetAllSets",
		zap.String("uuid", uuid),
	)

	pageId, err := strconv.Atoi(r.PathValue("pageID"))

	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// TODO: Validate request

	s := service.NewPageService(h.conn, r.Context(), logger)

	res, err := s.RetrieveSetsForPage(uuid, pageId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func (h *PageHandler) PostPage(w http.ResponseWriter, r *http.Request) {
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
		"PostPage",
		zap.String("uuid", uuid),
	)

	var reqBody *PostPageRequestBody

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Validate request
	if len(reqBody.Name) <= 0 || len(reqBody.Name) > 12 {
		http.Error(w, "Invalid page name", http.StatusBadRequest)
		return
	}

	s := service.NewPageService(h.conn, r.Context(), logger)

	newPage, err := s.CreateNewPage(uuid, reqBody.Name, reqBody.BookID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newPage)
}

func (h *PageHandler) DeletePage(w http.ResponseWriter, r *http.Request) {
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
		"DeletePage",
		zap.String("uuid", uuid),
	)

	// Retrieve value from the path
	pageID, err := strconv.Atoi(r.PathValue("pageID"))
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	s := service.NewPageService(h.conn, r.Context(), logger)

	if err := s.DeletePage(pageID, uuid); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
