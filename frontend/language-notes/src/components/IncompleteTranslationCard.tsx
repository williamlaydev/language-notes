import { useState } from "react"

type IncompleteTranslationCardProps = {
    language: string
    refreshPageFunc: (setId: number) => void
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

    const handleEnter = async (e) => {
        if (e.key === "Enter" && translatedInfo.english) {
            try {
                await translateEnglishWord(translatedInfo.english, translatedInfo.language);
                setTranslatedInfo(prev => ({
                    ...prev,
                    isTranslated: true
                }))
                props.refreshPageFunc(1);
                // Trigger refresh after successful translation          
            } catch (error) {
                console.error("Error translating the word:", error);
            }
        }
    }
    
    return (
        <div className="max-w-sm p-4 bg-yellow-100 border border-yellow-300 shadow-md text-center">
            <input 
                    className="w-full p-2 mb-4 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-yellow-500"
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

const translateEnglishWord = async (english: string, language: string) => {
    await fetch("http://localhost:8080/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        english: english,
        language: language,
      }),
    });
    // TODO: Response handling currently no response from backend
    // const data = await response.json();
    // console.log(data)
    // return {
    //   translated: data.translated,
    //   meaning: data.meaning,
    // };
  };

export default IncompleteTranslationCard