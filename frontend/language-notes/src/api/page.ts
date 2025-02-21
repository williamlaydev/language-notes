
export async function fetchPages(bookId: string, token: string) {
    try {
      const response = await fetch(`http://localhost:8080/book/${bookId}/pages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch pages");
      }
  
      const pages = await response.json();
  
      return pages.map((page: {id: number, name: string}) => ({
        id: page.id,
        name: page.name
      }));
  
    } catch (error) {
      console.error("Error fetching pages:", error);
      return [];
    }
};    

export async function createNewPage(bookId: number, name: string, token: string): Promise<string> {
  try {
    const response = await fetch(`http://localhost:8080/page`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name,
        bookId: bookId
      })
    });

    if (!response.ok) {
      throw new Error("Failed to create page");
    }

    const data = await response.json()
    return data.id
  } catch (error) {
    console.error("Error:", error);
    return ""
  }
}
