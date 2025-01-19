import { SupabaseContext } from "@/main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

function UserProfileNav() {
    const [userData, setUserData] = useState<UserDisplayData>({
        name: "",
        imgSrc: ""
    })

    const { isMobile } = useSidebar()

    const supabase = useContext(SupabaseContext)

    useEffect(() => {
        async function fetchUserData() {
            const {data, error} = await supabase.auth.getSession()

            if (error || !data.session) {
                throw new Error("Error fetching session: " + error.message)
            }

            let user = data.session.user.user_metadata
            setUserData({
                name: user.name,
                imgSrc: user.picture
            })
        }

        fetchUserData()
    }, [])

    async function handleSignOut() {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error(error)
      }
    }
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userData.imgSrc} />
                    <AvatarFallback className="rounded-lg">-</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userData.name}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut />
                  Log out
              </DropdownMenuItem>
              {/* <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
}

export default UserProfileNav;