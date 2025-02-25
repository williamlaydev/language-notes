export async function createBook(bookInfo: {name: string, language: string, pageName: string, setName: string}, token: string): Promise<string> {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/book`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(
                {
                    name: bookInfo.name,
                    language: bookInfo.language
                }
            )
        })

        if (!response.ok) {
            throw new Error("Failed to create book")
        }
        
        const data = await response.json()
        return data.id
    } catch (error) {
        console.error("Error creating new book:", error);
        return ""
    }
}

export async function fetchAllBooks(token: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/book`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })

        if (!response.ok) {
            throw new Error("Failed to fetch book")
        }

        const res = await response.json()
        return res.map((book: {id: number, name: string, language: string}) => (
            {
                id: book.id,
                name: book.name,
                language: book.language
            }
        ))
    } catch (error) {
        console.error("Error fetching books: ", error);
        return []
    }
}