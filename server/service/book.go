package service

import (
	"context"
	"languageNotes/db"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

type Book struct {
	conn    *pgxpool.Pool
	context context.Context
	logger  *zap.Logger
}

func NewBookService(p *pgxpool.Pool, c context.Context, l *zap.Logger) *Book {
	return &Book{conn: p, context: c, logger: l}
}

func (s *Book) RetrievePagesForBook(userID string, language string) ([]db.RetrievePagesForBookRow, error) {
	// Query the database to get all the pages for a book for user
	store := db.New(s.conn)
	u, _ := uuid.Parse(userID)

	p := db.RetrievePagesForBookParams{
		Language:  language,
		CreatorID: pgtype.UUID{Bytes: u, Valid: true},
	}

	res, err := store.RetrievePagesForBook(s.context, p)

	if err != nil {
		return nil, err
	}

	return res, nil
}
