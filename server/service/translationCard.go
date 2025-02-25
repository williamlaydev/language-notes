package service

import (
	"context"
	"languageNotes/db"
	"languageNotes/translator"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

type TranslationCard struct {
	conn    *pgxpool.Pool
	context context.Context
	logger  *zap.Logger
}

func NewTranslationService(p *pgxpool.Pool, c context.Context, l *zap.Logger) *TranslationCard {
	return &TranslationCard{conn: p, context: c, logger: l}
}

func (s *TranslationCard) CreateNewTranslationCard(userID string, english string, language string, setID int) error {
	// Make call to translator
	client := translator.NewChatGptClient()

	translatedWord, err := client.Translate(english, language)

	// TODO: Validate the response

	if err != nil {
		return err
	}

	// Add translatedWord to database
	// TODO: Add to specific user
	store := db.New(s.conn)

	u, _ := uuid.Parse(userID)
	p := db.CreateTranslationCardParams{
		English:    translatedWord.EnglishWithTones,
		Meaning:    translatedWord.Meaning,
		Translated: translatedWord.Translated,
		SetID:      int64(setID),
		Language:   translatedWord.Language,
		CreatorID:  pgtype.UUID{Bytes: u, Valid: true},
	}

	// TODO: Handle translation card response
	_, err = store.CreateTranslationCard(s.context, p)

	if err != nil {
		return err
	}

	return nil
}

func (s *TranslationCard) TranslationCards(userID string, setID int) ([]db.RetrieveTranslationCardsForSetRow, error) {
	// Query database for required data
	store := db.New(s.conn)

	u, _ := uuid.Parse(userID)
	p := db.RetrieveTranslationCardsForSetParams{
		SetID:     int64(setID),
		CreatorID: pgtype.UUID{Bytes: u, Valid: true},
	}

	translationCards, err := store.RetrieveTranslationCardsForSet(s.context, p)

	if err != nil {
		return nil, err
	}

	return translationCards, nil
}

func (s *TranslationCard) UpdateTranslationCard(userID string, cardID int, english string, meaning string, translated string) error {
	store := db.New(s.conn)

	u, _ := uuid.Parse(userID)
	p := db.UpdateTranslationCardParams{
		ID:         int64(cardID),
		CreatorID:  pgtype.UUID{Bytes: u, Valid: true},
		English:    english,
		Meaning:    meaning,
		Translated: translated,
	}

	// TODO: Handle translation card response
	_, err := store.UpdateTranslationCard(s.context, p)

	if err != nil {
		return err
	}

	return nil
}

func (s *TranslationCard) DeleteTranslationCard(cardID int, userID string) error {
	store := db.New(s.conn)
	u, _ := uuid.Parse(userID)

	p := db.DeleteTranslationCardParams{
		ID:        int64(cardID),
		CreatorID: pgtype.UUID{Bytes: u, Valid: true},
	}

	if err := store.DeleteTranslationCard(s.context, p); err != nil {
		return err
	}

	return nil
}
