export async function fetchTranslationCards(setId: number, token: string): Promise<TranslationCard[]> {
    const url = `${import.meta.env.VITE_SERVER_URL}/set/${setId}/translation-cards`;
  
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

export async function translateEnglishWord(english: string, language: string, token: string, setId: number) {
  await fetch("${import.meta.env.VITE_SERVER_URL}/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      english: english,
      language: language,
      setId: setId
    }),
  });
  // TODO: Response handling currently no response from backend
  // const data = await response.json();
  // console.log(data)
  // return {
  //   translated: data.translated,
  //   meaning: data.meaning,
  // };
};

export async function updateTranslationCard(english: string, meaning: string, translated: string, cardId: number, token: string) {
  await fetch(`${import.meta.env.VITE_SERVER_URL}/translation-card/${cardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      english: english,
      meaning: meaning,
      translated: translated
    }),
  })
}

export async function deleteTranslationCard(cardId: number, token: string) {
  await fetch(`${import.meta.env.VITE_SERVER_URL}/translation-card/${cardId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
}