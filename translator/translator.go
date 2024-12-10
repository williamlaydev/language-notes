package translator

type TranslatorTool interface {
	Translate(english string, desiredLanguage string) (string, error)
}

type TranslatedWord struct {
	English    string `json:"english"`
	Translated string `json:"translated"`
	Meaning    string `json:"meaning"`
	Language   string `json:"language"`
}
