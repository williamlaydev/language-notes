package translator

type TranslatorTool interface {
	Translate(english string, desiredLanguage string) (string, error)
}

type TranslatedWord struct {
	EnglishWithTones string `json:"englishWithTones"`
	Translated       string `json:"translated"`
	Meaning          string `json:"meaning"`
	Language         string `json:"language"`
}
