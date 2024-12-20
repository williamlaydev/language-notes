import { useEffect, useState } from 'react'
import './App.css'
import TranslationCard from './components/TranslationCard'

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

function App() {
  const [cards, setCards] = useState<TranslationCard[]>([])

  const fetchTranslationCards = async (setId: number) => {
    const url = `http://localhost:8080/translation-cards?setId=${setId}`;
  
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

      setCards([{
        id: 1,
        english: "",
        meaning: "",
        translated: "",
        language: "chinese", 
        creator_id: "123",
        created_at: "ttestdate", 
        set_id: 123
      }, ...data])
      return data;
    } catch (error) {
      console.error("Error fetching translation cards:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTranslationCards(1)
  }, [])

  return (
    <>
      <div className="flex flex-row w-full h-screen px-4 py-4">
        {/* Left Section: 40% */}
        <div className="w-2/5 bg-gray-100 p-4">
          <h2 className="text-lg font-bold">Nav area</h2>
        </div>
  
        {/* Right Section: 60% */}
        <div className="w-3/5 p-4">
          <div className="grid grid-cols-6 grid-rows-5 gap-4">
            {cards.map((card, index) => {
              return card.english === "" ? (
                <TranslationCard
                  key={index}
                  language={card.language}
                  english=""
                  meaning=""
                  translated=""
                  refreshPageFunc={fetchTranslationCards}
                />
              ) : (
                <TranslationCard
                  key={index}
                  language={card.language}
                  english={card.english}
                  meaning={card.meaning}
                  translated={card.translated}
                  refreshPageFunc={fetchTranslationCards}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
  
}


export default App
