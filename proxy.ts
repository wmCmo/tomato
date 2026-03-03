import { LocaleArr } from "@/types/Locale";
import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasLocale = LocaleArr.some((locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (hasLocale) return;

    return NextResponse.redirect(
        new URL(`/${LocaleArr[0]}${pathname}`, request.url),
    );
}

export const config = {
    matcher: ["/((?!_next|.*\\..*).*)"],
};
