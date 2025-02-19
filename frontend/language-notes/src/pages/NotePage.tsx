
import { useContext, useEffect, useState } from 'react'
import FileExplorer from '../components/FileExplorer/FileExplorer.tsx'
import { SupabaseContext } from '../index.tsx'  
import TranslationCardSection from '@/components/NotePage/TranslationCardSection.tsx';
import { BookOpen, PencilLine } from 'lucide-react';
import useFileExplorerStore from '@/stores/useFileExplorerStore.ts';
import { useParams } from 'react-router';

function NotePage() {
  const [selectedSet, setSelectedSet] = useState<SetDetails>({id: -1, name: ""})
  const [isEditMode, setIsEditMode] = useState(false)
  const {tree, setFileExplorerState} = useFileExplorerStore();

  const {bookId} = useParams()

  const supabase = useContext(SupabaseContext)

  const handleSetSelection = async (setId: number, setName: string) => {
    console.log(`getting cards for set ${setId}`)
   
    setSelectedSet({id: setId, name: setName})
  }

  useEffect(() => {
    setFileExplorerState(supabase, bookId || "")
  }, [])

    return (
      <>
        <div className="flex h-screen overflow-hidden">
          {/* File explorer */}
          <aside className="w-1/6">
            <FileExplorer bookId={bookId || ""} language="Chinese" fileExplorerData={tree} setSelectionCallbackFunction={handleSetSelection}/>
          </aside>

          <main className="flex-1 p-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <h1 className="text-xl font-semibold text-gray-900">{selectedSet.name}</h1>
              {
                isEditMode ? <BookOpen className="w-5 h-5 hover:bg-sidebar-accent cursor-pointer" onClick={() => setIsEditMode(prev => !prev)}/>
                : <PencilLine className="w-5 h-5 hover:bg-sidebar-accent cursor-pointer" onClick={() => setIsEditMode(prev => !prev)}/>
              }
              
            </div>
            <TranslationCardSection setId={selectedSet.id} isEditMode={isEditMode}/>
          </main>
        </div>
      </>
    )
}

export default NotePage
