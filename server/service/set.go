package service

import (
	"context"
	"languageNotes/db"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Set struct {
	conn    *pgxpool.Pool
	context context.Context
}

func NewSetService(p *pgxpool.Pool, c context.Context) *Set {
	return &Set{conn: p, context: c}
}

func (s *Set) CreateNewSet(name string, pageId int64) error {
	store := db.New(s.conn)

	uuidTemp, _ := uuid.Parse("f47c1a1b-2e71-4960-878d-cd70db13264e")
	p := db.CreateSingleSetParams{
		Name:      name,
		PageID:    pageId,
		CreatorID: pgtype.UUID{Bytes: uuidTemp, Valid: true},
	}

	// TODO: Handle return
	_, err := store.CreateSingleSet(s.context, p)

	if err != nil {
		return err
	}

	return nil
}
