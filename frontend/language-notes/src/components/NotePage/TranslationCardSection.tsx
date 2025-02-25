import { fetchTranslationCards } from "@/api/translationCard";
import { useCallback, useContext, useEffect, useState } from "react";
import CompletedTranslationCard from "./CompletedTranslationCard";
import IncompleteTranslationCard from "./IncompleteTranslationCard";
import { SupabaseContext } from "@/index";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../ui/resizable";
import EditableTranslationCard from "./EditableTranslationCard";
import { ScrollArea } from "../ui/scroll-area";
import useCurrentBookStore from "@/stores/useCurrentBookStore";
import { Button } from "../ui/button";
import { deleteSet } from "@/api/set";

type TranslationCardSectionProps = {
    setId: number
    isEditMode: boolean
    resetSelectedSet: () => void
}

function TranslationCardSection(props: TranslationCardSectionProps) {
    const [translationCards, setTranslationCards] = useState<TranslationCard[]>([])
    const {language} = useCurrentBookStore()
    const supabase = useContext(SupabaseContext)
    const initialisePage = useCallback(async () => {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error || !data.session) {
                throw new Error("Error fetching session: " + (error?.message || "No session data"));
            }

            const token = data.session.access_token || "";
            const res = await fetchTranslationCards(props.setId, token);
            if (res == null) {
              setTranslationCards([]);
              return
            }

            setTranslationCards(res)
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

    async function handleDeleteSet(setId: number) {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
          throw new Error("Error fetching session: " + (error?.message || "No session data"));
      }

      const token = data.session.access_token || "";
      await deleteSet(setId, token)
      props.resetSelectedSet()
    }

    if (translationCards.length == 0) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-auto gap-4">
          <div>
            <p>Translate the first word!</p>
            <IncompleteTranslationCard
                language={language}
                refreshPageFunc={initialisePage}
                setId={props.setId}
            />
          </div>
        </div>
      )
    }
    return (
      <>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            <ScrollArea className="h-full w-full pb-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-auto gap-4 ">
                  {props.isEditMode ? (
                    <>
                      <div className="max-w-sm p-4 text-center">
                        <div className="flex flex-col items-center text-center">
                            <p></p>
                            <p></p>
                            <p></p>
                        </div>
                      </div>
                      {translationCards.map((card) => (
                        <EditableTranslationCard
                          key={card.id}
                          setId={props.setId}
                          cardId={card.id}
                          english={card.english}
                          meaning={card.meaning}
                          translated={card.translated}
                          refreshPageFunc={initialisePage}
                        />
                      ))}
                      <div className="col-span-full absolute bottom-4 right-4 p-4">
                          <Button onClick={() => handleDeleteSet(props.setId)} variant="destructive">Delete page</Button>
                        </div>
                    </>
                  ) : (
                    <>
                      <IncompleteTranslationCard
                        language={language}
                        refreshPageFunc={initialisePage}
                        setId={props.setId}
                        
                      />
                      {translationCards.map((card) => (
                        <CompletedTranslationCard
                          key={card.id}
                          language={card.language}
                          english={card.english}
                          meaning={card.meaning}
                          translated={card.translated}
                        
                        />
                      ))}
                    </>
                  )}
                  
              </div>
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle />
          {/* <ResizablePanel>
            <div>
              <h1>Coming soon...</h1>
            </div>
          </ResizablePanel> */}
        </ResizablePanelGroup>
      </>
    );

}



export default TranslationCardSection;
