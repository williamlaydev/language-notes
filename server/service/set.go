package service

import (
	"context"
	"languageNotes/db"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

type Set struct {
	conn    *pgxpool.Pool
	context context.Context
	logger  *zap.Logger
}

func NewSetService(p *pgxpool.Pool, c context.Context, l *zap.Logger) *Set {
	return &Set{conn: p, context: c, logger: l}
}

func (s *Set) CreateNewSet(userID string, name string, pageId int64) error {
	store := db.New(s.conn)

	u, _ := uuid.Parse(userID)
	p := db.CreateSingleSetParams{
		Name:      name,
		PageID:    pageId,
		CreatorID: pgtype.UUID{Bytes: u, Valid: true},
	}

	// TODO: Handle return
	_, err := store.CreateSingleSet(s.context, p)

	if err != nil {
		return err
	}

	return nil
}

func (s *Set) DeleteSet(setID int, userID string) error {
	store := db.New(s.conn)
	u, _ := uuid.Parse(userID)

	p := db.DeleteSetParams{
		ID:        int64(setID),
		CreatorID: pgtype.UUID{Bytes: u, Valid: true},
	}

	if err := store.DeleteSet(s.context, p); err != nil {
		return err
	}

	return nil
}
