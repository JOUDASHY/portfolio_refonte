import { NextResponse, type NextRequest } from "next/server";

const LOCALE_COOKIE = "lang";
const SUPPORTED = new Set(["en", "fr"]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore static and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If path already has /en or /fr, ensure cookie matches and continue
  const pathLocale = pathname.split("/")[1];
  if (SUPPORTED.has(pathLocale)) {
    // Protect backoffice: require access token from cookies or header
    if (pathname.startsWith(`/${pathLocale}/backoffice`)) {
      const token = req.cookies.get("access_token")?.value;
      // When using client storage, we cannot read it here; optionally, allow header-based auth
      const hasBearer = req.headers.get("authorization")?.toLowerCase().startsWith("bearer ");
      if (!token && !hasBearer) {
        const url = req.nextUrl.clone();
        url.pathname = `/${pathLocale}/login`;
        return NextResponse.redirect(url);
      }
    }
    const res = NextResponse.next();
    res.cookies.set(LOCALE_COOKIE, pathLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  // Redirect root or non-localized path to preferred locale
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const headerLocale = req.headers.get("accept-language")?.toLowerCase().startsWith("fr")
    ? "fr"
    : "en";
  const locale = SUPPORTED.has(cookieLocale || "") ? cookieLocale! : headerLocale;
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Match all paths except: API routes, Next.js internals, static files with extensions
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)",
  ],
};


