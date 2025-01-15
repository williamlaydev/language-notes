export async function fetchPages(language: string, token: string) {
    try {
      const response = await fetch(`http://localhost:8080/book/pages?language=${language}`, {
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
  
