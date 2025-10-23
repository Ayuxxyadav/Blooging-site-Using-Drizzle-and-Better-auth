import { headers} from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {getSessionCookie} from 'better-auth/cookies'


const protectedRoutes = ['/profile', '/post/create','/post/edit']


export async function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname

    const session = getSessionCookie(request)
    const isProtectedRoute = protectedRoutes.some(route=> pathName.startsWith(route))

    if(isProtectedRoute && !session) {
        //redirect user => to auth page because user is not logged in
        return NextResponse.redirect(new URL ("/auth", request.url));

    }
    if(pathName ==='/auth' && session){
        // if user is already logged in and user
        // is trying to /auth route they will directly 
        // redirect to homepage
        return NextResponse.redirect(new URL('/', request.url));

    }
    return NextResponse.next()

}

export const config = {
    matcher: ['/profile/:path*', '/post/create', '/post/edit/:path*', '/auth']
}