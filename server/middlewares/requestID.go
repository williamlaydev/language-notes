package middlewares

import (
	"context"
	"net/http"

	"github.com/google/uuid"
)

func RequestID() Middleware {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			id := uuid.New().String()

			r = r.WithContext(context.WithValue(r.Context(), RequestIDKey, id))

			h.ServeHTTP(w, r)
		})
	}
}
