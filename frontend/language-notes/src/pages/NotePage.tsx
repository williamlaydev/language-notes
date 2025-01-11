import { useContext, useEffect, useState } from 'react'
import IncompleteTranslationCard from '../components/IncompleteTranslationCard'
import CompletedTranslationCard from '../components/CompletedTranslationCard'
import FileExplorer from '../components/fileExplorer/FileExplorer'
import { GoogleLogin } from '@react-oauth/google';
import { SupabaseContext } from '../main.tsx'

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
  const supabase = useContext(SupabaseContext)
  
  const fetchTranslationCards = async (setId: number) => {
    const url = `http://localhost:8080/set/${setId}/translation-cards`;
  
    try {
      const {data, error} = await supabase.auth.getSession()
      if (error) {
        throw new Error("Error fetching session: " + error.message)
      }

      const token = data?.session?.access_token

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

      setCards([...translationCards])
      return translationCards;
    } catch (error) {
      console.error("Error fetching translation cards:", error);
      throw error;
    }
  };

  const handleSetSelection = (setId: number) => {
    console.log(`getting cards for set ${setId}`)
    fetchTranslationCards(setId || 0)
  }
  
  const handleSignInWithGoogle = async (response) => {
    // TODO: Error handling
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential, // TODO: PASS THIS TO BACKEND
    })

    if (error) {
      console.error("Supabase Auth Error:", error.message);
    } else {
      console.log("Supabase Auth Success:", data.session.access_token);
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut({ scope: 'local' })
  }

  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  if (!session) {
      return ( 
        <>
          <h1> Not logged in </h1>
          <GoogleLogin onSuccess={handleSignInWithGoogle} onError={()=>console.log("nogood")}/>
        </>
        
      )
  }
  else {
    return (
      <>
        <div className="flex flex-row w-full h-screen">
          {/* FileNav */}
          <div className="w-1/6">
            <FileExplorer setChosenSetIdCallback={handleSetSelection}/>
            <button onClick={handleSignOut}>Sign out</button>
          </div>
    
          {/* Right Section: 60% */}
          <div className="w-3/5 p-4">
            <div className="grid grid-cols-6 grid-rows-5 gap-4">
                <IncompleteTranslationCard
                  language={"chinese"}
                  refreshPageFunc={fetchTranslationCards}
                />
              {cards.map(card => {
                return (
                  <CompletedTranslationCard
                    key={card.id}
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
    )
  }
}


export default NotePage
