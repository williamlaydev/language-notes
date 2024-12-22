package service

import (
	"context"
	"languageNotes/db"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Book struct {
	conn    *pgxpool.Pool
	context context.Context
}

func NewBookService(p *pgxpool.Pool, c context.Context) *Book {
	return &Book{conn: p, context: c}
}

func (s *Book) RetrievePagesForBook(userId string, language string) ([]db.RetrievePagesForBookRow, error) {
	// Query the database to get all the pages for a book for user
	store := db.New(s.conn)
	uuidTemp, _ := uuid.Parse("f47c1a1b-2e71-4960-878d-cd70db13264e")

	p := db.RetrievePagesForBookParams{
		Language:  language,
		CreatorID: pgtype.UUID{Bytes: uuidTemp, Valid: true},
	}

	res, err := store.RetrievePagesForBook(s.context, p)

	if err != nil {
		return nil, err
	}

	return res, nil
}
