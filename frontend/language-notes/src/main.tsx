import { createRoot } from 'react-dom/client'
import NotePage from './pages/NotePage'
import './index.css'
import './output.css'
import { BrowserRouter, Routes, Route } from "react-router"

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<NotePage />} />
      </Routes>
  </BrowserRouter>
)
