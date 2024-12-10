package service

import "languageNotes/translator"

type Translation struct {
}

func NewTranslationService() *Translation {
	return &Translation{}
}

func (s *Translation) TranslateEnglishToLanguage(english string, desiredLanguage string) (*translator.TranslatedWord, error) {
	client := translator.NewChatGptClient()

	translatedWord, err := client.Translate(english, desiredLanguage)

	if err != nil {
		return &translator.TranslatedWord{}, err
	}

	return translatedWord, nil
}
