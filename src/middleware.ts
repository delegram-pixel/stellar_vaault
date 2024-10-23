import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/group(.*)"])

export default clerkMiddleware(async (auth, req) => {

    const baseHost = "localhost:3000"
    const host = req.headers.get("host")
    const reqPath = req.nextUrl.pathname
    const origin = req.nextUrl.origin

    // Redirect root path to /site
    if (
        reqPath === "/" ||
        (reqPath  === "/site" && host === process.env.NEXT_PUBLIC_DOMAIN)
      ) {
        return NextResponse.rewrite(new URL("/site", req.url));
      }
    

    if (reqPath === "/sign-in") {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url))
    }
  
    if (reqPath === "/sign-up") {
        return NextResponse.redirect(new URL("/auth/sign-up", req.url))
    }

    if (reqPath === "/admin/sign-in") {
        return NextResponse.redirect(
          new URL("/auth/admin/auth/sign-in", req.url)
        );
      }
  
      // Redirect for /admin/sign-up
      if (reqPath === "/admin/sign-up") {
        return NextResponse.redirect(
          new URL("/auth/admin/auth/sign-up", req.url)
        );
      }
    if (isProtectedRoute(req)) auth().protect()
    if (!baseHost.includes(host as string) && reqPath.includes("/group")) {
        const response = await fetch(`${origin}/api/domain?host=${host}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        const data = await response.json()
        if (data.status === 200 && data) {
            return NextResponse.rewrite(
                new URL(reqPath, `https://${data.domain}/${reqPath}`),
            )
        }
    }
})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}