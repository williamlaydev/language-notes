
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

export async function createNewPage(bookId: number, name: string, token: string): Promise<boolean> {
  try {
    const reqBody = {
      name: name,
      bookId: bookId
    }

    const response = await fetch(`http://localhost:8080/page`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(reqBody)
    });

    if (!response.ok) {
      throw new Error("Failed to create page");
    }

    return true
  } catch (error) {
    console.error("Error:", error);
    return false
  }
}
