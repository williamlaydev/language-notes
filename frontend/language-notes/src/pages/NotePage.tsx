
import { useContext, useEffect, useState } from 'react'
import FileExplorer from '../components/FileExplorer/FileExplorer.tsx'
import { SupabaseContext } from '../main.tsx'  
import TranslationCardSection from '@/components/NotePage/TranslationCardSection.tsx';
import { fetchPages } from '@/api/page.ts';
import { fetchSets } from '@/api/set.ts';

function NotePage() {
  const [fileExplorerData, setFileExplorerData] = useState({
    tree: [] as PageNode[]
  })

  const [selectedSet, setSelectedSet] = useState<SetDetails>({id: -1, name: ""})
  const [session, setSession] = useState(null)
  const supabase = useContext(SupabaseContext)

  const handleSetSelection = async (setId: number, setName: string) => {
    console.log(`getting cards for set ${setId}`)
   
    setSelectedSet({id: setId, name: setName})
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut({ scope: 'local' })
  }

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
      
      setFileExplorerData((prev) => ({
        tree: [
          ...prev.tree,
          {
            id: page.id,
            name: page.name,
            sets,
          } as PageNode,
        ]
      }));
    }
  };

  useEffect(() => {
    fetchFileExplorerData()  
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setSession(session)
    // })

    // const {
    //   data: { subscription },
    // } = supabase.auth.onAuthStateChange((_event, session) => {
    //   setSession(session)
    // })

    // return () => subscription.unsubscribe()
  }, [supabase.auth])

  // if (!session) {
  //   //TODO: CHANGE THIS
  //   console.log("Not logged in")
  // } else {
    return (
      <>
        <div className="flex flex-row w-full h-screen">
          {/* File explorer */}
          <div className="w-1/6">
            <FileExplorer language="Chinese" fileExplorerData={fileExplorerData.tree} setSelectionCallbackFunc={handleSetSelection}/>
          </div>

          <div className="w-3/5 p-4">
            <h1>{selectedSet.name}</h1>
            <TranslationCardSection setId={selectedSet.id}/>
          </div>
        </div>
      </>
    )
}

export default NotePage
