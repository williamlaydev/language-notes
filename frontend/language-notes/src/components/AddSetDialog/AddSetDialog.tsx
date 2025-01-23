import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SupabaseContext } from "@/main";
import { useContext, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createNewSet } from "@/api/set";
  
type AddSetDialogProps = {
    refreshFunction: () => void;
    setId: number
}

function AddSetDialog(props: AddSetDialogProps) {
    const [open, setOpen] = useState(false);
    const supabase = useContext(SupabaseContext)
    
    async function handleCreateSet(values: z.infer<typeof formSchema>) {
        const {data, error} = await supabase.auth.getSession()

        if (error || !data.session) {
            throw new Error("Error fetching session: " + error.message)
        }
        const token = data?.session?.access_token || ""

        await createNewSet(props.setId, values.setName, token)

        // TODO: Use this once bookid is sorted const isSuccess = await createNewSet(bookId, values.pageName, token)
        props.refreshFunction()
        setOpen(false)
    }

    const formSchema = z.object({
        setName: z.string()
            .min(1, "Name must be at least 1 character")
            .max(12, "Name must be less than 12 characters"),
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            setName: "",
        }
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <FolderPlus className="w-4 h-4 hover:bg-sidebar-accent"/>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new page</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateSet)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="setName"
                            render={({ field }) => (
                                <FormItem> 
                                    <FormLabel>Page name</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="off" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddSetDialog;