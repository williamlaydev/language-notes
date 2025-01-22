import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SupabaseContext } from "@/main";
import { useContext } from "react";
import { createNewSet } from "@/api/set";
import { toast } from "sonner";
  
function AddSetDialog() {
    const supabase = useContext(SupabaseContext)
    
    async function handleCreateSet(pageId: number, name: string) {
        const {data, error} = await supabase.auth.getSession()

        if (error || !data.session) {
            throw new Error("Error fetching session: " + error.message)
        }
        const token = data?.session?.access_token || ""

        const isSuccess = await createNewSet(pageId, name, token)

        if (isSuccess) {
            toast(`New Set ${name} has been created`)
        } else {
            toast(`Error creating new Set`)
        }
        
    }

    return (
        <Dialog>
            <DialogTrigger className="ml-auto hover:bg-sidebar-accent">
                <SquarePlus  onClick={()=>console.log("test")}/>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new set</DialogTitle>
                    {/* <DialogDescription>
                    </DialogDescription> */}
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Set name
                        </Label>
                        <Input id="name" className="col-span-3" autoComplete={"off"}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => handleCreateSet}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddSetDialog;