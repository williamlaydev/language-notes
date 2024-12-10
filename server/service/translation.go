package service

import "languageNotes/translator"

type Translation struct {
}

func NewTranslationService() *Translation {
	return &Translation{}
}

func (s *Translation) TranslateEnglishToLanguage(english string, language string) (*translator.TranslatedWord, error) {
	client := translator.NewChatGptClient()

	translatedWord, err := client.Translate(english, language)

	if err != nil {
		return &translator.TranslatedWord{}, err
	}

	return translatedWord, nil
}
