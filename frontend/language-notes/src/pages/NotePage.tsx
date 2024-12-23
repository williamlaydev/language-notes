import { useState } from 'react'

import IncompleteTranslationCard from '../components/IncompleteTranslationCard'
import CompletedTranslationCard from '../components/CompletedTranslationCard'
import FileExplorer from '../components/fileExplorer/FileExplorer'

type TranslationCard = {
  id: number;
  creator_id: string; // UUID
  english: string;
  meaning: string;
  translated: string;
  created_at: string; // ISO date string
  set_id: number;
  language: string;
};

function NotePage() {
  const [cards, setCards] = useState<TranslationCard[]>([])

  const fetchTranslationCards = async (setId: number) => {
    const url = `http://localhost:8080/set/${setId}/translation-cards`;
  
    try {
      const response = await fetch(url, {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();

      setCards([...data])
      return data;
    } catch (error) {
      console.error("Error fetching translation cards:", error);
      throw error;
    }
  };

  const handleSetSelection = (setId: number) => {
    console.log(`getting cards for set ${setId}`)
    fetchTranslationCards(setId || 0)
  }

  return (
    <>
      <div className="flex flex-row w-full h-screen">
        {/* FileNav */}
        <div className="w-1/6">
          <FileExplorer setChosenSetIdCallback={handleSetSelection}/>
        </div>
  
        {/* Right Section: 60% */}
        <div className="w-3/5 p-4">
          <div className="grid grid-cols-6 grid-rows-5 gap-4">
              <IncompleteTranslationCard
                language={"chinese"}
                refreshPageFunc={fetchTranslationCards}
              />
            {cards.map((card, index) => {
              return (
                <CompletedTranslationCard
                  key={index}
                  language={card.language}
                  english={card.english}
                  meaning={card.meaning}
                  translated={card.translated}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
  
}


export default NotePage
