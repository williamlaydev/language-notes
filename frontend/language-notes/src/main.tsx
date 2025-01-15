import { createRoot } from 'react-dom/client';
import NotePage from './pages/NotePage';
import './index.css';
import './output.css';
import { BrowserRouter, Routes, Route } from "react-router";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createClient } from '@supabase/supabase-js';
import { createContext } from 'react';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';

const supabaseUrl = 'https://hyafqkgqapxjrruqqbbj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5YWZxa2dxYXB4anJydXFxYmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjM0MjQsImV4cCI6MjA1MDA5OTQyNH0.5CvfVYZyHMgLS3_yWqvCsokmqvKnd5Zmk9JCYpFRx6Y';
const supabase = createClient(supabaseUrl, supabaseKey);

export const SupabaseContext = createContext(supabase)

const App = () => {
  return (
    <GoogleOAuthProvider clientId="890406772240-u05db9b7e0ue0afbvam0mc7olpo2t8pv.apps.googleusercontent.com">
      <SupabaseContext.Provider value={supabase}>
        <SidebarProvider>
            <BrowserRouter>
            <SidebarTrigger/>
              <Routes>
                <Route path="/" element={<NotePage />} />
              </Routes>
            </BrowserRouter>
        </SidebarProvider>
      </SupabaseContext.Provider>
    </GoogleOAuthProvider>
  );
};

// Render the App
createRoot(document.getElementById('root')!).render(<App />);
