import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

let locales = ['en', 'az', 'ar', 'zh', 'fr', 'de', 'hi', 'hu', 'it', 'fa', 'ru', 'es', 'tr', 'uk'];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        const locale = 'en'; // Default locale
        return NextResponse.redirect(
            new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
        );
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, api, static, etc.)
        '/((?!api|_next/static|_next/image|ads.txt|robots.txt|sitemap.xml|favicon.ico).*)',
    ],
};
