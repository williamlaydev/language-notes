-- TranslationCards --

-- name: RetrieveTranslationCardsForSet :many
SELECT tc.id, tc.creator_id, tc.english, tc.meaning, tc.translated, tc.created_at, tc.set_id, tc.language
FROM translation_cards tc
JOIN
    Sets s ON tc.set_id = s.id
JOIN Users u ON tc.creator_id = u.uuid
WHERE
    tc.set_id = $1 AND tc.creator_id = $2
ORDER BY tc.created_at;

-- name: CreateTranslationCard :one
INSERT INTO translation_cards (
    english, meaning, translated, set_id, language, creator_id
) VALUES (
    $1, $2, $3, $4, $5, $6
)
RETURNING *;