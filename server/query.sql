-- TranslationCards --

-- name: RetrieveTranslationCardsForSet :many
SELECT tc.id, tc.english, tc.meaning, tc.translated, tc.created_at, tc.set_id, tc.language
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

-- name: UpdateTranslationCard :one
UPDATE translation_cards
SET
    meaning = COALESCE(NULLIF(@meaning::text, ''), meaning),
    translated = COALESCE(NULLIF(@translated::text, ''), translated),
    english = COALESCE(NULLIF(@english::Text, ''), english)
WHERE
    id = $1 AND creator_id = $2
RETURNING *;

-- name: DeleteTranslationCard :exec
DELETE FROM translation_cards
WHERE 
    id = $1 AND creator_id = $2;

-- Sets --

-- name: RetrieveSetsForPage :many
SELECT s.id, s.name, s.page_id
FROM sets s
JOIN
    pages p ON s.page_id = p.id
JOIN Users u ON s.creator_id = u.uuid
WHERE
    s.page_id = $1 AND s.creator_id = $2;

-- name: CreateSingleSet :one
INSERT INTO sets (
    name, page_id, creator_id
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: UpdateSet :one
UPDATE sets
SET
    name = COALESCE(NULLIF(@name::text, ''), name)
WHERE
    id = $1 AND creator_id = $2
RETURNING *;

-- name: DeleteSet :exec
DELETE FROM sets
WHERE 
    id = $1 AND creator_id = $2;

-- Pages --

-- name: RetrievePagesForBook :many
SELECT p.id, p.name
FROM pages p
JOIN
    book b ON b.id = $1
JOIN Users u ON p.creator_id = u.uuid
WHERE
    p.creator_id = $2;

-- name: CreateSinglePage :one
INSERT INTO pages (
    name, book_id, creator_id
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: UpdatePage :one
UPDATE pages
SET
    name = COALESCE(NULLIF(@name::text, ''), name)
WHERE
    id = $1 AND creator_id = $2
RETURNING *;

-- name: DeletePage :exec
DELETE FROM pages
WHERE 
    id = $1 AND creator_id = $2;
-- Books --
-- name: RetrieveAllBooks :many
SELECT b.id, b.name, b.language
FROM book b
WHERE
    b.creator_id = $1;

-- name: CreateSingleBook :one
INSERT INTO book (
    name, creator_id, language
) VALUES (
    $1, $2, $3
) RETURNING *;