'use client';

import useDict from "@/hooks/useDict";
import { LocaleType } from "@/types/Locale";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

// Every route starts with "/en" or "/ja", so switching language swaps that prefix and keeps the rest of the path.
export default function useSwitchLocale() {
    const router = useRouter();
    const pathName = usePathname();
    const { locale } = useDict();

    const switchLocale = useCallback((target: LocaleType) => {
        if (target === locale) return;
        router.push(`/${target}${pathName.substring(3)}`);
    }, [locale, pathName, router]);

    return { locale, switchLocale };
}

// Alt+L flips between the two languages from anywhere under /main, now that the toggle lives in Settings.
export function useLocaleShortcut() {
    const { locale, switchLocale } = useSwitchLocale();
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.altKey && e.code === "KeyL") switchLocale(locale === "en" ? "ja" : "en");
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [locale, switchLocale]);
}
