import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ko"];
const defaultLocale = "en";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's an API route or static file or internal next path
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return (auth as any)(request);
  }

  // Check if pathname has locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Redirect to default locale
    const locale = defaultLocale;
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // If locale is present, proceed with auth
  return (auth as any)(request);
}
