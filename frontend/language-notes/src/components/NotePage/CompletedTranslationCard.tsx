import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type TranslationCardProps = {
    english: string;
    meaning: string;
    translated: string;
    language: string;
};

function CompletedTranslationCard(props: TranslationCardProps) {
    return (
        <div className="max-w-sm p-4 text-center">
            <Accordion type="single" defaultValue={props.english} collapsible>
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
            </Accordion>
        </div>
    );
}

export default CompletedTranslationCard;
