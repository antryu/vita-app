import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/auth/login", "/auth/signup", "/auth/callback"];
const API_PATHS = ["/api/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || API_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // TODO: Check Supabase session from cookie
  // For now, allow all requests (mock auth)
  // const supabase = createServerClient(...)
  // const { data: { session } } = await supabase.auth.getSession()
  // if (!session) return NextResponse.redirect(new URL("/auth/login", request.url))

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png).*)"],
};
