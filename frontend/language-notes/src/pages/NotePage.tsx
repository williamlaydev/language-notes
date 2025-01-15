
import { useContext, useEffect, useState } from 'react'
import FileExplorer from '../components/fileExplorer/FileExplorer.tsx'
import { GoogleLogin } from '@react-oauth/google';
import { SupabaseContext } from '../main.tsx'  
import TranslationCardSection from '@/components/NotePage/TranslationCardSection.tsx';
import { fetchPages } from '@/api/page.ts';
import { fetchSets } from '@/api/set.ts';

function NotePage() {
  const [fileExplorerData, setFileExplorerData] = useState<PageNode[]>([])
  const [selectedSet, setSelectedSet] = useState<SetDetails>({id: -1, name: ""})
  const supabase = useContext(SupabaseContext)

  const handleSetSelection = async (setId: number, setName: string) => {
    console.log(`getting cards for set ${setId}`)
   
    setSelectedSet({id: setId, name: setName})
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

  async function fetchFileExplorerData() {
    const {data, error} = await supabase.auth.getSession()
  
    if (error || !data.session) {
      throw new Error("Error fetching session: " + error.message)
    }
  
    const token = data?.session?.access_token || ""
  
    const pages = await fetchPages("chinese", token);
  
    // Populate the sets for each page
    for (const page of pages) {
      const sets = await fetchSets(page.id, token)
      
      setFileExplorerData((prev) => [
        ...prev,
        {
          id: page.id,
          name: page.name,
          sets,
        } as PageNode,
      ]);
    }
  };

  useEffect(() => {
    fetchFileExplorerData()

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
          {/* File explorer */}
          <div className="w-1/6">
            <FileExplorer language="Chinese" fileExplorerData={fileExplorerData} setSelectionCallbackFunc={handleSetSelection}/>
          </div>

          <div className="w-3/5 p-4">
            <h1>{selectedSet.name}</h1>
            <TranslationCardSection setId={selectedSet.id}/>
          </div>
        </div>
      </>
    )
  }
}

export default NotePage
