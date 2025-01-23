
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
  const supabase = useContext(SupabaseContext)

  const handleSetSelection = async (setId: number, setName: string) => {
    console.log(`getting cards for set ${setId}`)
   
    setSelectedSet({id: setId, name: setName})
  }

  async function fetchFileExplorerData() {
    const {data, error} = await supabase.auth.getSession()

    if (error || !data.session) {
      throw new Error("Error fetching session: " + error.message)
    }
  
    const token = data?.session?.access_token || ""
  
    const pages = await fetchPages("chinese", token);
    
    // Populate the sets for each page
    const tempTree = {
      tree: [] as PageNode[]
    }

    for (const page of pages) {
      const sets = await fetchSets(page.id, token)
      
      // TODO: Handle if sets is empty
      tempTree.tree.push({
        id: page.id,
        name: page.name,
        sets
      })
    }

    setFileExplorerData(tempTree)
  };

  useEffect(() => {
    fetchFileExplorerData()  

  }, [supabase.auth])
    return (
      <>
        <div className="flex flex-row w-full h-screen">
          {/* File explorer */}
          <div className="w-1/6">
            <FileExplorer language="Chinese" fileExplorerData={fileExplorerData.tree} setSelectionCallbackFunction={handleSetSelection} fileExplorerRefreshFunction={fetchFileExplorerData}/>
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
