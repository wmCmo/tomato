'use client';

import { LocaleType } from "@/types/Locale";
import { TranslateIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";


const ToggleLang = ({ locale, pathName }: { locale: LocaleType, pathName: string; }) => {
    const router = useRouter();

    const changeLocale = useCallback(() => {
        const location = pathName.substring(3);
        const newLocale = locale === "en" ? "ja" : "en";
        router.push(`/${newLocale}${location}`);
    }, [locale, pathName, router]);

    const handleKeys = useCallback((e: KeyboardEvent) => {
        if (!e.altKey) return;
        if (e.code === "KeyL") changeLocale();
    }, [changeLocale]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [handleKeys]);

    return (
        <button type="button" className="p-2 rounded-md bg-foreground flex justify-center items-center transition-all duration-200 ease-out hover:translate-y-0.5" onClick={changeLocale}>
            <TranslateIcon weight={'bold'} className="text-muted" />
        </button>
    );
};

export default ToggleLang;
