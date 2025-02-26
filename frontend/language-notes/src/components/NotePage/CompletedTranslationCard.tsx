type TranslationCardProps = {
    english: string;
    meaning: string;
    translated: string;
    language: string;
};

function CompletedTranslationCard(props: TranslationCardProps) {
    return (
        // className="p-4 break-words overflow-visible"
        <div className="max-w-sm p-4 text-center">
            {/* <Accordion type="single" defaultValue={props.english} collapsible>
                <AccordionItem value={props.english}>
                    <AccordionTrigger >
                        {props.english}
                    </AccordionTrigger>
                    <AccordionContent>
                        {props.translated}
                        <br />
                        {props.meaning}
                    </AccordionContent>
                </AccordionItem>
            </Accordion> */}
            <div className="flex flex-col items-center text-center">
                <p>{props.english}</p>
                <p>{props.translated}</p>
                <p>{props.meaning}</p>
            </div>
        </div>
    );
}

export default CompletedTranslationCard;
