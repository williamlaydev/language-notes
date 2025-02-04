import { ArrowUpRight, ChevronRight, File, FilePlus, Folder, Link, MoreHorizontal, StarOff, Trash2 } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import UserProfileNav from "./UserProfileNav.tsx";
import AddPageDialog from "../AddPageDialog/AddPageDialog.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { useContext, useState } from "react";
import { createNewSet } from "@/api/set.ts";
import { SupabaseContext } from "@/index.tsx";
import { SupabaseClient } from "@supabase/supabase-js";
import useFileExplorerStore from "@/stores/useFileExplorerStore.ts";

type FileExplorerProps = {
  setSelectionCallbackFunction: (setId: number, setName: string) => void;
  fileExplorerData: PageNode[];
  language: string
};

const FileExplorer = (props: FileExplorerProps) => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarGroupLabel>{props.language}</SidebarGroupLabel>
          <SidebarGroupLabel className="ml-auto"><AddPageDialog/></SidebarGroupLabel>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <PagesTree pages={props.fileExplorerData} setSelectionFunc={props.setSelectionCallbackFunction}/>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <UserProfileNav/>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

type PagesTreeProps = {
  pages: PageNode[];
  setSelectionFunc: (setId: number, setName: string) => void;
}

function PagesTree(props: PagesTreeProps) {
  const { isMobile } = useSidebar();
  const [open, setOpen] = useState(false);
  const supabase = useContext(SupabaseContext)
  const {setFileExplorerState} = useFileExplorerStore();
  const formSchema = z.object({
    setName: z.string()
      .min(1, "Name must be at least 1 character")
      .max(12, "Name must be less than 12 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      setName: "",
    },
  });

  async function handleCreateSet(values: z.infer<typeof formSchema>, pageId: number) {
    const {data, error} = await supabase.auth.getSession()
    
    if (error || !data.session) {
        throw new Error("Error fetching session: " + error.message)
    }
    const token = data?.session?.access_token || ""

    await createNewSet(pageId, values.setName, token)
    // TODO : Error handle
    setFileExplorerState(supabase)
    setOpen(false)
  }

  return (
    <>
      {props.pages.map((page) => (
        <Collapsible key={page.id} className="group/collapsible">
          <CollapsibleTrigger asChild>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                <Folder />
                {page.name}
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <FilePlus className="text-muted-foreground" />
                        <span>Add new page</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create a new page</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(values => handleCreateSet(values, page.id))} className="space-y-8">
                          <FormField
                            control={form.control}
                            name="setName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Page name</FormLabel>
                                <FormControl>
                                  <Input autoComplete="off" placeholder="Enter name" {...field} />
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SetsTree sets={page.sets} setSelectionFunc={props.setSelectionFunc} />
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </>
  );
}


function SetsTree({ sets, setSelectionFunc}: { sets: SetDetails[], setSelectionFunc: (setId: number, setName: string) => void}) {
  return (
    <>
      {sets.map((set) => (
        <SidebarMenuItem key={set.id}>
          <SidebarMenuButton onClick={() => setSelectionFunc(set.id, set.name)}>
            <File />
            {set.name}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}

export default FileExplorer;
