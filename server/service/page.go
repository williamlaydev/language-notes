package service

import (
	"context"
	"languageNotes/db"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

type Page struct {
	conn    *pgxpool.Pool
	context context.Context
	logger  *zap.Logger
}

func NewPageService(p *pgxpool.Pool, c context.Context, l *zap.Logger) *Page {
	return &Page{conn: p, context: c, logger: l}
}

func (s *Page) RetrieveSetsForPage(userID string, pageId int) ([]db.RetrieveSetsForPageRow, error) {
	// Query database for required data
	store := db.New(s.conn)
	u, _ := uuid.Parse(userID)
	p := db.RetrieveSetsForPageParams{
		PageID:    int64(pageId),
		CreatorID: pgtype.UUID{Bytes: u, Valid: true},
	}

	res, err := store.RetrieveSetsForPage(s.context, p)

	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *Page) CreateNewPage(userID string, name string, bookId int64) (db.Page, error) {
	store := db.New(s.conn)

	u, _ := uuid.Parse(userID)
	p := db.CreateSinglePageParams{
		Name:      name,
		BookID:    bookId,
		CreatorID: pgtype.UUID{Bytes: u, Valid: true},
	}

	// TODO: Handle return
	newPage, err := store.CreateSinglePage(s.context, p)

	if err != nil {
		return db.Page{}, err
	}

	return newPage, nil
}

func (s *Page) DeletePage(pageID int, userID string) error {
	store := db.New(s.conn)
	u, _ := uuid.Parse(userID)

	p := db.DeletePageParams{
		ID:        int64(pageID),
		CreatorID: pgtype.UUID{Bytes: u, Valid: true},
	}

	if err := store.DeletePage(s.context, p); err != nil {
		return err
	}

	return nil
}
