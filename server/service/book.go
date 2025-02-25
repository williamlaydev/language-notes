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

func (s *Book) RetrievePagesForBook(userID string, bookID int) ([]db.RetrievePagesForBookRow, error) {
	// Query the database to get all the pages for a book for user
	store := db.New(s.conn)
	u, _ := uuid.Parse(userID)

	p := db.RetrievePagesForBookParams{
		ID:        int64(bookID),
		CreatorID: pgtype.UUID{Bytes: u, Valid: true},
	}

	res, err := store.RetrievePagesForBook(s.context, p)

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *Book) RetrieveAllBooks(userID string) ([]db.RetrieveAllBooksRow, error) {
	store := db.New(s.conn)
	u, _ := uuid.Parse(userID)

	res, err := store.RetrieveAllBooks(s.context, pgtype.UUID{Bytes: u, Valid: true})

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *Book) CreateNewBook(userID string, name string, language string) (db.Book, error) {
	store := db.New(s.conn)
	u, _ := uuid.Parse(userID)

	p := db.CreateSingleBookParams{
		Name:      name,
		CreatorID: pgtype.UUID{Bytes: u, Valid: true},
		Language:  language,
	}

	book, err := store.CreateSingleBook(s.context, p)
	if err != nil {
		return db.Book{}, err
	}

	return book, nil
}
