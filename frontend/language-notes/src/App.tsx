import { useState } from 'react'
import './App.css'
import TranslationCard from './components/TranslationCard'
import { translationCards } from './database'

function App() {
  let cards = [
    {
      english: "",
      meaning: "",
      translated: "",
      language: "chinese"
    }, 
    ...translationCards
  ]

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
                />
              ) : (
                <TranslationCard
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

export default App
