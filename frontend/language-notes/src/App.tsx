import { useState } from 'react'
import './App.css'
import TranslationCard from './components/TranslationCard'

function App() {
  return (
    <>
      <div>
        <TranslationCard language="chinese"/>
        <TranslationCard language="chinese"/>
        <TranslationCard language="chinese"/>
      </div>
    </>
  )
}

export default App
