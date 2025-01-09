package middlewares

import (
	"fmt"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

var AUTH_SIGN_KEY = []byte(os.Getenv("AUTH_SIGN_KEY"))

func TestFunc(token string) {
	decodedJwt, err := verifyToken(token)

	if err != nil {
		// TODO: ERROR
	}
	fmt.Printf("Token verified: %v+", decodedJwt)
}

func verifyToken(tokenString string) (*jwt.Token, error) {
	// Parse the token with the secret key
	decoded, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return AUTH_SIGN_KEY, nil
	})

	if err != nil {
		return nil, err
	}

	if !decoded.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return decoded, nil
}
