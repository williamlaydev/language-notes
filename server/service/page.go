package service

import (
	"context"
	"languageNotes/db"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Page struct {
	conn    *pgxpool.Pool
	context context.Context
}

func NewPageService(p *pgxpool.Pool, c context.Context) *Page {
	return &Page{conn: p, context: c}
}

func (s *Page) RetrieveSetsForPage(userId string, pageId int) ([]db.Set, error) {
	// Query database for required data
	store := db.New(s.conn)
	uuidTemp, _ := uuid.Parse("f47c1a1b-2e71-4960-878d-cd70db13264e")
	p := db.RetrieveSetsForPageParams{
		PageID:    int64(pageId),
		CreatorID: pgtype.UUID{Bytes: uuidTemp, Valid: true},
	}

	res, err := store.RetrieveSetsForPage(s.context, p)

	if err != nil {
		return nil, err
	}

	return res, nil
}
