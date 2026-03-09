import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          response.cookies.set(name, value, options)
        },
        remove(name: string, options) {
          response.cookies.set(name, "", { ...options, maxAge: 0 })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect only admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {

    if (!user) {
      return NextResponse.redirect(
        new URL(`/auth/login?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url)
      )
    }

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!profile || profile.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }

    } catch {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}