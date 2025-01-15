export async function fetchTranslationCards(setId: number, token: string): Promise<TranslationCard[]> {
    const url = `http://localhost:8080/set/${setId}/translation-cards`;
  
    try {
      const response = await fetch(url, {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const translationCards = await response.json();
  
      return translationCards;
    } catch (error) {
      console.error("Error fetching translation cards:", error);
      throw error;
    }
};