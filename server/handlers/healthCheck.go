package handlers

import (
	"net/http"

	"go.uber.org/zap"
)

type HealthCheckHandler struct {
}

func NewHealthCheckHandler() *HealthCheckHandler {
	return &HealthCheckHandler{}
}

func (h *HealthCheckHandler) Ping(w http.ResponseWriter, r *http.Request) {
	logger, err := createLoggerForRequest(r)

	if err != nil {
		zap.L().Error("requestID not set")
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	logger.Info("Ping")

	w.Write([]byte("ok"))
}
