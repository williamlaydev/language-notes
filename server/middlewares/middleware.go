package middlewares

import (
	"context"
	"net/http"

	"github.com/google/uuid"
)

type Middleware func(http.Handler) http.Handler

type contextKey string

const (
	RequestIDKey contextKey = "requestID"
)

func ApplyMiddleware(h http.Handler, middlewares ...Middleware) http.Handler {
	for i := len(middlewares) - 1; i >= 0; i-- {
		h = middlewares[i](h)
	}
	return h
}

func RequestID() Middleware {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			id := uuid.New().String()

			r = r.WithContext(context.WithValue(r.Context(), RequestIDKey, id))

			h.ServeHTTP(w, r)
		})
	}
}
