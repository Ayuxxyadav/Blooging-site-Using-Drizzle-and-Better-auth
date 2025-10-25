"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import UserMenu from "../auth/user-menu"
import ThemeToggle from "../theme/theme-toggle"

const navItems= [{
    label :'Home', href : '/',
    },{
    label :'Create', href : '/post/create',
    },{
    label :'Home', href : '/',
    },
]

export default function Header() {
    const {data: session,isPending}= useSession()
    const router = useRouter()
    return (
       <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className=" flex items-center gap-6">
                <Link href={"/"}
                className="font-bold text-xl">
                    Next.js 15 Blog
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                       {
                       navItems.map((item, index) => (
  <Link key={item.href + index} href={item.href} 
    className={cn("text-sm font-medium transition-colors hover:text-primary")}>
    {item.label}
  </Link>
))
                       }
                    </nav>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  {/* Search bar */}
                </div>
               <ThemeToggle/>
                <div className="flex items-center gap-2">
                    {isPending ? null : session?.user ?( <UserMenu user={session?.user}/> ) : ( 
                        <Button className="cursor-pointer"
                         onClick={()=>{router.push("/auth")}}
                          variant={"default"}
                          >
                            Login

                        </Button>)}
                </div>
                
            </div>
        </div>
       </header>
    ) 
}