import { ChevronRight, File, Folder } from "lucide-react"
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from "@/components/ui/sidebar"
import UserProfileNav from "./UserProfileNav.tsx";
import AddPageDialog from "../AddPageDialog/AddPageDialog.tsx";

type FileExplorerProps = {
  setSelectionCallbackFunc: (setId: number, setName: string) => void;
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
                <PagesTree pages={props.fileExplorerData} setSelectionFunc={props.setSelectionCallbackFunc}/>
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

function PagesTree({ pages, setSelectionFunc }: {pages: PageNode[], setSelectionFunc: (setId: number, setName: string) => void}) {
  return (
    <>
      {pages.map((page) => (
        <Collapsible key={page.id} className="group/collapsible">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
              <Folder />
              {page.name}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SetsTree sets={page.sets} setSelectionFunc={setSelectionFunc}/>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </>
  )
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
