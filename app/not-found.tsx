
import '@/app/index.css';
import { LocaleArr, LocaleType } from "@/types/Locale";
import { headers } from "next/headers";
import Link from "next/link";

async function getDict(locale: LocaleType) {
    return (await import(`@/dictionary/${locale}`)).default;
}

export default async function NotFoundPage() {
    const headersList = await headers();
    const url = headersList.get("x-next-url") ?? headersList.get("referer") ?? "";
    const segment = url.split("/").filter(Boolean).at(2) ?? "";
    const locale: LocaleType = LocaleArr.includes(segment as LocaleType) ? segment as LocaleType : "en";
    const dict = await getDict(locale);
    return (
        <div className={`text-accent px-8 space-y-4 ${locale === "en" ? "font-display" : "font-jp"} h-dvh flex flex-col items-center justify-center bg-white`}>
            <h1 className="text-5xl text-center">404</h1>
            <p className="text-center">👀 {dict.notFound.desc || "Page not found"}</p>
            <div className="flex items-center justify-center gap-4">
                <p className="text-xs text-center">{dict.notFound.suggest || "This page does not exist"}</p>
                <Link href={`/${locale}/main`} className='inline-block bg-foreground px-4 py-2 rounded-lg font-bold active:translate-y-1'>
                    🍅 {dict.components.return2Home}
                </Link>
            </div>
        </div>
    );
}
