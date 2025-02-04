
import { useContext, useEffect, useState } from 'react'
import FileExplorer from '../components/FileExplorer/FileExplorer.tsx'
import { SupabaseContext } from '../index.tsx'  
import TranslationCardSection from '@/components/NotePage/TranslationCardSection.tsx';
import { BookOpen, PencilLine } from 'lucide-react';
import useFileExplorerStore from '@/stores/useFileExplorerStore.ts';

function NotePage() {
  const [selectedSet, setSelectedSet] = useState<SetDetails>({id: -1, name: ""})
  const [isEditMode, setIsEditMode] = useState(false)
  const {tree, setFileExplorerState} = useFileExplorerStore();

  const supabase = useContext(SupabaseContext)

  const handleSetSelection = async (setId: number, setName: string) => {
    console.log(`getting cards for set ${setId}`)
   
    setSelectedSet({id: setId, name: setName})
  }

  useEffect(() => {
    setFileExplorerState(supabase)
  }, [])

    return (
      <>
        <div className="flex flex-row w-full h-screen">
          {/* File explorer */}
          <div className="w-1/6">
            <FileExplorer language="Chinese" fileExplorerData={tree} setSelectionCallbackFunction={handleSetSelection}/>
          </div>

          <div className="w-5/6 p-4">
            <div className="flex flex-row">
              <h1>{selectedSet.name}</h1>
              {
                isEditMode ? <BookOpen className="w-5 h-5 hover:bg-sidebar-accent cursor-pointer" onClick={() => setIsEditMode(prev => !prev)}/>
                : <PencilLine className="w-5 h-5 hover:bg-sidebar-accent cursor-pointer" onClick={() => setIsEditMode(prev => !prev)}/>
              }
              
            </div>
            <TranslationCardSection setId={selectedSet.id} isEditMode={isEditMode}/>
          </div>
        </div>
      </>
    )
}

export default NotePage
