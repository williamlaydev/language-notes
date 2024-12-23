package service

import (
	"context"
	"languageNotes/db"
	"languageNotes/translator"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type TranslationCard struct {
	conn    *pgxpool.Pool
	context context.Context
}

func NewTranslationService(p *pgxpool.Pool, c context.Context) *TranslationCard {
	return &TranslationCard{conn: p, context: c}
}

func (s *TranslationCard) CreateNewTranslationCard(english string, language string) error {
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

	uuidTemp, _ := uuid.Parse("f47c1a1b-2e71-4960-878d-cd70db13264e")
	p := db.CreateTranslationCardParams{
		English:    translatedWord.EnglishWithTones,
		Meaning:    translatedWord.Meaning,
		Translated: translatedWord.Translated,
		SetID:      1,
		Language:   translatedWord.Language,
		CreatorID:  pgtype.UUID{Bytes: uuidTemp, Valid: true},
	}

	// TODO: Handle translation card response
	_, err = store.CreateTranslationCard(s.context, p)

	if err != nil {
		return err
	}

	return nil
}

func (s *TranslationCard) RetrieveTransactionCards(userId string, setId int) ([]db.RetrieveTranslationCardsForSetRow, error) {
	// Query database for required data
	store := db.New(s.conn)

	uuidTemp, _ := uuid.Parse("f47c1a1b-2e71-4960-878d-cd70db13264e")
	p := db.RetrieveTranslationCardsForSetParams{
		SetID:     int64(setId),
		CreatorID: pgtype.UUID{Bytes: uuidTemp, Valid: true},
	}

	translationCards, err := store.RetrieveTranslationCardsForSet(s.context, p)

	if err != nil {
		return nil, err
	}

	return translationCards, nil
}
