import { createRoot } from 'react-dom/client';
import NotePage from './pages/NotePage';
import './index.css';
import './output.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import BookCreationPage from './pages/BookCreationPage';
import OrientationPage from './pages/OrientationPage';

const supabaseUrl = 'https://hyafqkgqapxjrruqqbbj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5YWZxa2dxYXB4anJydXFxYmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjM0MjQsImV4cCI6MjA1MDA5OTQyNH0.5CvfVYZyHMgLS3_yWqvCsokmqvKnd5Zmk9JCYpFRx6Y';
const supabase = createClient(supabaseUrl, supabaseKey);

export const SupabaseContext = createContext(supabase);

const App = () => {
  return (
    <GoogleOAuthProvider clientId="890406772240-u05db9b7e0ue0afbvam0mc7olpo2t8pv.apps.googleusercontent.com">
      <SupabaseContext.Provider value={supabase}>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoutes supabase={supabase}><NotePage/></ProtectedRoutes>} path="/book/:bookId"/>
            <Route element={<ProtectedRoutes supabase={supabase}><BookCreationPage/></ProtectedRoutes>} path="/book/create"/>
            <Route element={<ProtectedRoutes supabase={supabase}><OrientationPage/></ProtectedRoutes>} path="/orientation"/>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </SupabaseContext.Provider>
    </GoogleOAuthProvider>
  );
};

// Render the App
createRoot(document.getElementById('root')!).render(<App />);

function ProtectedRoutes({ supabase, children }: { supabase: SupabaseClient; children: React.ReactNode }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>
}
