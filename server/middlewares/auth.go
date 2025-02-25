package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func UserJwtAuthentication(authSignKey []byte) Middleware {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authorizationHeader := r.Header.Get("Authorization")

			if authorizationHeader == "" {
				http.Error(w, "Missing credentials", http.StatusBadRequest)
				return
			}

			const prefix = "Bearer "
			if !strings.HasPrefix(authorizationHeader, prefix) {
				http.Error(w, "Missing credentials", http.StatusBadRequest)
				return
			}

			token := strings.TrimPrefix(authorizationHeader, prefix) // jwt as string

			decodedJwt, err := verifyToken(token, authSignKey)

			if err != nil {
				http.Error(w, "Invalid credentials", http.StatusForbidden)
				return
			}

			uuid, err := extractUUIDfromJwt(decodedJwt)

			if err != nil {
				http.Error(w, "Invalid credentials", http.StatusForbidden)
				return
			}

			r = r.WithContext(context.WithValue(r.Context(), UUIDKey, uuid))

			h.ServeHTTP(w, r)
		})
	}
}

// This function validates the token has been correctly signed by Supabase
func verifyToken(tokenString string, authSignKey []byte) (*jwt.Token, error) {
	// Parse the token with the secret key
	decoded, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return authSignKey, nil
	})

	if err != nil {
		return nil, err
	}

	if !decoded.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return decoded, nil
}

// Take the subject from the JWT
func extractUUIDfromJwt(jwt *jwt.Token) (string, error) {
	uuid, err := jwt.Claims.GetSubject()

	if err != nil {
		return "", err
	}

	return uuid, nil
}
