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
import { SupabaseContext } from "@/index";
import { useContext, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createNewPage } from "@/api/page";
import useFileExplorerStore from "@/stores/useFileExplorerStore";
import useCurrentBookStore from "@/stores/useCurrentBookStore";

function AddPageDialog() {
    const [open, setOpen] = useState(false);
    const {setFileExplorerState} = useFileExplorerStore();
    const {id} = useCurrentBookStore();
    const supabase = useContext(SupabaseContext)
    // const {toast} = useToast()

    async function handleCreatePage(values: z.infer<typeof formSchema>) {
        
        // If form is invalid this function will not be called.
        const {data, error} = await supabase.auth.getSession()

        if (error || !data.session) {
            throw new Error("Error fetching session: " + (error?.message || ""))
        }
        const token = data?.session?.access_token || ""

        await createNewPage(id, values.pageName, token)
        // if (isSuccess) {
            
        //     return toast({
        //         description: `${values.pageName} has been successfuly created.`
        //     })
        // } else {
        //     return toast({
        //         variant: "destructive",
        //         description: `Unexpected error has occurred!`
        //     })
        // }
        setFileExplorerState(supabase, id.toString())
         // TODO : Error handle
        setOpen(false)
    }

    const formSchema = z.object({
        pageName: z.string()
            .min(1, "Name must be at least 1 character")
            .max(12, "Name must be less than 12 characters"),
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pageName: "",
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <FolderPlus className="w-4 h-4 hover:bg-sidebar-accent"/>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new category</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreatePage)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="pageName"
                            render={({ field }) => (
                                <FormItem> 
                                    <FormLabel>Category name</FormLabel>
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

export default AddPageDialog;