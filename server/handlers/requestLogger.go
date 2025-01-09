package handlers

import (
	"errors"
	"languageNotes/middlewares"
	"net/http"

	"go.uber.org/zap"
)

func createLoggerForRequest(r *http.Request) (*zap.Logger, error) {
	id, ok := r.Context().Value(middlewares.RequestIDKey).(string)

	if !ok {
		return nil, errors.New("requestID not set in context")
	}

	return zap.L().With(zap.String("requestID", id)), nil
}
