import { deleteTranslationCard, updateTranslationCard } from "@/api/translationCard"
import { SupabaseContext } from "@/index"
import { useState, useContext } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "../ui/button"

type EditableTranslationCardProps = {
    setId: number
    cardId: number
    english: string
    meaning: string
    translated: string
    refreshPageFunc: (setId: number, token: string) => void
}

function EditableTranslationCard(props: EditableTranslationCardProps) {
    const [translatedInfo, setTranslatedInfo] = useState({
        english: props.english,
        meaning: props.meaning,
        translated: props.translated
    })
    const [isDelete, setIsDelete] = useState(false)

    const supabase = useContext(SupabaseContext)

    const handleEnter = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && translatedInfo.english) {
            try {
                const {data, error} = await supabase.auth.getSession()
    
                if (error || !data.session) {
                throw new Error("Error fetching session: " + error.message)
                }
            
                const token = data?.session?.access_token || ""

                await updateTranslationCard(translatedInfo.english, translatedInfo.meaning, translatedInfo.translated, props.cardId, token);

                setTranslatedInfo(prev => ({
                    ...prev,
                    isTranslated: true
                }))

                props.refreshPageFunc(props.setId, token)
            } catch (error) {
                console.error("Error translating the word:", error);
            }
        }
    }

    const handleDelete = async (cardId: number) => {
        const {data, error} = await supabase.auth.getSession()

        if (error || !data.session) {
        throw new Error("Error fetching session: " + error.message)
        }
    
        const token = data?.session?.access_token || ""

        try {
            await deleteTranslationCard(cardId, token)
            props.refreshPageFunc(props.setId, token)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        // p-4 break-words overflow-visible
        <>
            {
                isDelete ? 
                    <div className="flex flex-col items-center text-center">
                        <Button className="w-3/5 h-6 mt-3" onClick={() => handleDelete(props.cardId)} size={"sm"} variant="destructive">Delete</Button>
                        <Button className="w-3/5 h-6 mt-1" onClick={() => setIsDelete(prev => !prev)} size={"sm"} variant="secondary">Undo</Button>
                    </div>
                :
                    <div className="relative flex flex-col items-center text-center">
                        <Trash2 size={12} className="absolute top-2 right-2 cursor-pointer hover:bg-sidebar-accent" onClick={() => setIsDelete(prev => !prev)}/>
                        <input 
                            type="text"
                            className="w-full text-center border-none focus:outline-none bg-transparent"
                            onChange={(e) => setTranslatedInfo(prev => ({
                                ...prev,
                                english: e.target.value 
                            }))}
                            value={translatedInfo.english}
                            onKeyDown={(e) => handleEnter(e)}
                        />
                        <input 
                            type="text"
                            className="w-full text-center border-none focus:outline-none bg-transparent"
                            onChange={(e) => setTranslatedInfo(prev => ({
                                ...prev,
                                translated: e.target.value 
                            }))}
                            value={translatedInfo.translated}
                            onKeyDown={(e) => handleEnter(e)}
                        />
                        <input 
                            type="text"
                            className="w-full text-center border-none focus:outline-none bg-transparent"
                            onChange={(e) => setTranslatedInfo(prev => ({
                                ...prev,
                                meaning: e.target.value 
                            }))}
                            value={translatedInfo.meaning}
                            onKeyDown={(e) => handleEnter(e)}
                        />
                    </div>
            }
        </>
    )
}

export default EditableTranslationCard;