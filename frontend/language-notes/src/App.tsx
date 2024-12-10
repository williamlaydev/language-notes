import { useState } from 'react'
import './App.css'

function App() {
  const [english, setEnglish] = useState("")
  const [translatedInfo, setTranslatedInfo] = useState({
    translatedWord: "",
    meaning: "",
  })

  const makeTranslation = (english: string, desiredLanguage: string) => {
    fetch("http://localhost:8080/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        english: english,
        language: desiredLanguage
      })
    }).then(res => res.json())
    .then(data => {
      setTranslatedInfo(() => {
        return {
          translatedWord: data.translated,
          meaning: data.meaning
        }
      })
    })
  }

  return (
    <>
      <div>
        <input type="text" id="english-word-input" onChange={(e) => {setEnglish(()=>{return e.target.value})}}></input>
        <button onClick={() => {makeTranslation(english, "chinese")}}>Translate</button>
        <h3>{translatedInfo.translatedWord}</h3>
        <h3>{translatedInfo.meaning}</h3>
      </div>
    </>
  )
}

export default App
