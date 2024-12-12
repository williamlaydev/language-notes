import { useState } from "react"

type TranslationCardProps = {
    language: string
}

type TranslatedInfo = {
    english: string
    meaning: string
    translated: string
    language: string
}

function TranslationCard(props: TranslationCardProps) {
    const [translatedInfo, setTranslatedInfo] = useState<TranslatedInfo>({
        english: "",
        meaning: "",
        translated: "",
        language: props.language
    })

    const [isTranslated, setIsTranslated] = useState(false)

    const handleUnfocus = async () => {
        if (!isTranslated) {
            const res = await translateEnglishWord(translatedInfo.english, translatedInfo.language)
            setIsTranslated(true)
            setTranslatedInfo(prev => ({
                ...prev,
                meaning: res.meaning,
                translated: res.translated
            }))
        }
    }

    const handleEnter = async (e) => {
        if (e.key === "Enter") {
            if (!isTranslated) {
                const res = await translateEnglishWord(translatedInfo.english, translatedInfo.language)
                setIsTranslated(true)
                setTranslatedInfo(prev => ({
                    ...prev,
                    meaning: res.meaning,
                    translated: res.translated
                }))
            }
        }
    }
    return (
        <div className="max-w-sm p-4 bg-yellow-100 border border-yellow-300 rounded-lg shadow-md">
            <input 
                className="w-full p-2 mb-4 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-yellow-500"
                type="text"
                onChange={(e) => setTranslatedInfo(prev => ({
                    ...prev,
                   english: e.target.value 
                }))}
                onBlur={() => handleUnfocus()}
                onKeyDown={(e) => handleEnter(e)}
            />
            <h3 className="text-lg font-medium text-gray-800" >{translatedInfo.translated}</h3>
            <h3 className="text-sm text-gray-600">{translatedInfo.meaning}</h3>
        </div>
    )
}

const translateEnglishWord = async (english: string, language: string): Promise<{ translated: string; meaning: string }> => {
    const response = await fetch("http://localhost:8080/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        english: english,
        language: language,
      }),
    });
    const data = await response.json();
    return {
      translated: data.translated,
      meaning: data.meaning,
    };
  };

export default TranslationCard