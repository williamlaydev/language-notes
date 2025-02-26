import { translateEnglishWord } from "@/api/translationCard"
import { SupabaseContext } from "@/index"
import { useContext, useState } from "react"

type IncompleteTranslationCardProps = {
    language: string
    refreshPageFunc: (setId: number, token: string) => void
    setId: number
}

type TranslatedInfo = {
    english: string
    language: string
    isTranslated: boolean
}

function IncompleteTranslationCard(props: IncompleteTranslationCardProps) {
    const [translatedInfo, setTranslatedInfo] = useState<TranslatedInfo>({
        english: "",
        language: props.language,
        isTranslated: false
    })

    const supabase = useContext(SupabaseContext)
    
    // TODO: Validate if should be done
    // const handleUnfocus = async () => {
    //     if (translatedInfo.english) {
    //         try {
    //             await translateEnglishWord(translatedInfo.english, translatedInfo.language);
    //             // Trigger refresh after successful translation
    //             setTranslatedInfo(prev => ({
    //                 ...prev,
    //                 isTranslated: true
    //             }))
    //             props.refreshPageFunc(1);
    //         } catch (error) {
    //             console.error("Error translating the word:", error);
    //         }
    //     }
        
    // }

    const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && translatedInfo.english) {
            try {
                const {data, error} = await supabase.auth.getSession()
  
                if (error || !data.session) {
                    throw new Error("Error fetching session: " + (error?.message || ""))
                }
            
                const token = data?.session?.access_token || ""

                await translateEnglishWord(translatedInfo.english, translatedInfo.language, token, props.setId);

                setTranslatedInfo(prev => ({
                    ...prev,
                    isTranslated: true
                }))
                
                props.refreshPageFunc(props.setId, token);
                // Trigger refresh after successful translation          
            } catch (error) {
                console.error("Error translating the word:", error);
            }
        }
    }
    
    return (
        // className="p-4 break-words overflow-visible"
        <div className="max-w-sm p-4 text-center">
            <input 
                className="w-full p-2 mb-4 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-stone-600"
                type="text"
                onChange={(e) => setTranslatedInfo(prev => ({
                    ...prev,
                    english: e.target.value 
                }))}
                // onBlur={() => handleUnfocus()}
                onKeyDown={(e) => handleEnter(e)}
                placeholder={translatedInfo.english}
            />
        </div>
    )
}

export default IncompleteTranslationCard