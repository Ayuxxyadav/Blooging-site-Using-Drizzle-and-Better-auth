"use client"
import {ThemeProvider as NextThemesProvider, ThemeProviderProps} from "next-themes"
import Header from "../layout/header"
import { cn } from "@/lib/utils"

interface extendedThemeProviderProps extends ThemeProviderProps{
 containerClassName?:string
}

export default function ThemeProvider ({
    children,
    containerClassName,
    ...props } : extendedThemeProviderProps ){
    return (
       <NextThemesProvider { ...props}>
         <Header/>
         <main className={cn("container mx-auto px-4")}>
            {children}
         </main>
       </NextThemesProvider>
    )
}