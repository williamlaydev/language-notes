type TranslationCardProps = {
    english: string
    meaning: string
    translated: string
    language: string
}

function CompletedTranslationCard(props: TranslationCardProps) {
    return (
        <div className="max-w-sm p-4 bg-yellow-100 border border-yellow-300 shadow-md text-center">
            <h3 className="text-lg font-medium text-gray-800">{props.english}</h3>
            <h3 className="text-lg font-medium text-gray-800" >{props.translated}</h3>
            <h3 className="text-sm text-gray-600">{props.meaning}</h3>
        </div>
    )
}

export default CompletedTranslationCard