"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent } from "../ui/dropdown-menu"
import { User } from "better-auth"
import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "../ui/button"
import { Ghost, LogOut, PenSquare, UserIcon } from "lucide-react"
import { Avatar } from "../ui/avatar"
import { AvatarFallback } from "@radix-ui/react-avatar"
import Link from "next/link"
import { signOut } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"



interface UserMenuProps {
    user: User
}

export default function UserMenu({user}:UserMenuProps){
const [isLoading, setIsLoading] = useState(false)
const router = useRouter()

const getInitials =(name:string)=> {
    return name.split("").
    map((n)=>n[0])
    .join("")
    .toUpperCase();
}
const handleLogout = async () =>{
    setIsLoading(true)
   try{
   await signOut({
    fetchOptions: {
        onSuccess :  ()=>{
            toast('You have been logged out successfully')
            router.refresh()
        }
    }
   })
}catch(e){
console.log(e);
toast("Failed to log out! Please try again")
}finally{
    setIsLoading(false)
 }
};

    return <DropdownMenu>
    <DropdownMenuTrigger asChild>
    <Button variant={"ghost"}
    className="relative h-8 w-8 rounded-full"
    >
        <Avatar>
            <AvatarFallback>{getInitials(user?.name) || "User"}</AvatarFallback>
        </Avatar>

    </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
     <div className="flex items-center justify-start gap-2 p-2">
        <div className="flex flex-col space-y-1 leading-none">
            <p className="font-bold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
     </div>
     <DropdownMenuSeparator/>
     <DropdownMenuItem className="cursor-pointer" asChild>
       <Link href="/profile">
       <UserIcon className="mr-2 h-4 w-4"/>
       <span>Profile</span>
       </Link>
     </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" asChild>
       <Link href="/post/create">
       <PenSquare className="mr-2 h-4 w-4"/>
       <span>Create Post</span>
       </Link>
     </DropdownMenuItem>
     <DropdownMenuSeparator/>
     <DropdownMenuItem  onClick={handleLogout} disabled={isLoading} className="cursor-pointer">
        <LogOut className="mr-3 h-4 w-4"/>
        <span>{isLoading ? 'Logging out...': "Logut"}</span>
     </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
}