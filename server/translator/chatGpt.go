package translator

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

type ChatGpt struct {
}

type responseFormat struct {
	Type       string          `json:"type"`
	JsonSchema json.RawMessage `json:"json_schema"`
}

type chatGptRequest struct {
	Model          string          `json:"model"`
	Message        [2]*message     `json:"messages"`
	ResponseFormat *responseFormat `json:"response_format"`
}

type message struct {
	Role    string  `json:"role"`
	Content string  `json:"content"`
	Refusal *string `json:"refusal"`
}

type Choice struct {
	Message message `json:"message"`
}

type Usage struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}

type ChatGptResponse struct {
	Choices []Choice `json:"choices"`
	Usage   Usage    `json:"usage"`
}

func NewChatGptClient() *ChatGpt {
	return &ChatGpt{}
}

func (c *ChatGpt) Translate(english string, language string) (*TranslatedWord, error) {
	log.Printf("Translate %s", english)
	body := newChatGptRequest(english, language)
	j, err := json.Marshal(body)

	if err != nil {
		return &TranslatedWord{}, err
	}

	req, err := http.NewRequest(http.MethodPost, "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(j))

	if err != nil {
		return &TranslatedWord{}, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+os.Getenv("OPEN_AI_KEY"))

	client := &http.Client{Timeout: 5 * time.Second}

	res, err := client.Do(req)

	if err != nil {
		return &TranslatedWord{}, err
	}

	defer res.Body.Close()

	var chatGptResponse ChatGptResponse

	if res.StatusCode != http.StatusOK {
		errBody, _ := io.ReadAll(res.Body)
		return &TranslatedWord{}, errors.New(string(errBody))
	} else {
		err = json.NewDecoder(res.Body).Decode(&chatGptResponse)
		if err != nil {
			return &TranslatedWord{}, err
		}
	}

	translated := &TranslatedWord{
		English:  english,
		Language: language,
	}

	content := chatGptResponse.Choices[0].Message.Content

	if err := json.Unmarshal([]byte(content), &translated); err != nil {
		return &TranslatedWord{}, err
	}

	return translated, nil
}

func newChatGptRequest(english string, language string) *chatGptRequest {
	// Query specifics of GPT
	roleDescription := "You are a professional translator. Please translate the word " + english + " to " + language + ". Return only the translated word in " + language + " and its meaning. If you can't do it return Null for all"

	messages := [2]*message{
		{Role: "system", Content: roleDescription},
		{Role: "user", Content: english},
	}

	prettyJSON := `{
		"name": "translator",
		"schema": {
			"type": "object",
			"properties": {
				"translated": { "type": "string" },
				"meaning": { "type": "string" }
			},
			"required": ["translated", "meaning"],
			"additionalProperties": false
		},
		"strict": true
	}`
	var compacted bytes.Buffer
	json.Compact(&compacted, []byte(prettyJSON))

	rawJson := json.RawMessage(compacted.Bytes())

	return &chatGptRequest{
		Model:   "gpt-4o-mini",
		Message: messages,
		ResponseFormat: &responseFormat{
			Type:       "json_schema",
			JsonSchema: rawJson,
		},
	}
}
