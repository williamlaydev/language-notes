import { fetchTranslationCards } from "@/api/translationCard";
import { useCallback, useContext, useEffect, useState } from "react";
import CompletedTranslationCard from "./CompletedTranslationCard";
import IncompleteTranslationCard from "./IncompleteTranslationCard";
import { SupabaseContext } from "@/index";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../ui/resizable";
import EditableTranslationCard from "./EditableTranslationCard";

type TranslationCardSectionProps = {
    setId: number
    isEditMode: boolean
}

function TranslationCardSection(props: TranslationCardSectionProps) {
    const [translationCards, setTranslationCards] = useState<TranslationCard[]>([])
  
    const supabase = useContext(SupabaseContext)
    const initialisePage = useCallback(async () => {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error || !data.session) {
                throw new Error("Error fetching session: " + (error?.message || "No session data"));
            }

            const token = data.session.access_token || "";
            const res = await fetchTranslationCards(props.setId, token);
            setTranslationCards(res);
        } catch (error) {
            console.error("Error initialising translation cards section: " + error);
        }
    }, [props.setId, supabase.auth]);

    useEffect(() => {
      // Waits for setId to be picked
      // TODO: Fix this implementation
      if (props.setId != -1) {
        initialisePage();
      }
        
    }, [initialisePage, props.setId]);

    return (
      <>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            <div className="grid grid-cols-9 grid-rows-5">
            {
              props.isEditMode ? 
                translationCards.map(card => {
                  return (
                    <EditableTranslationCard
                      key={card.id}
                      setId={props.setId}
                      cardId={card.id}
                      english={card.english}
                      meaning={card.meaning}
                      translated={card.translated}
                      refreshPageFunc={initialisePage}
                    />
                  )
                })
              :
                <>
                  <IncompleteTranslationCard
                    language={"chinese"}
                    refreshPageFunc={initialisePage}
                    setId={props.setId}
                  />
                  {translationCards.map(card => {
                    return (
                      <CompletedTranslationCard
                        key={card.id}
                        language={card.language}
                        english={card.english}
                        meaning={card.meaning}
                        translated={card.translated}
                      />
                    )
                  })}
                </>
            }
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <div>
              <h1>
                Sentences
              </h1>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </>
    )
}



export default TranslationCardSection;
