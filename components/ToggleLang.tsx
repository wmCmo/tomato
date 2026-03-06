'use client';

import { LocaleType } from "@/types/Locale";
import { TranslateIcon } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";


const ToggleLang = ({ locale, pathName }: { locale: LocaleType, pathName: string; }) => {
    const router = useRouter();

    const changeLocale = useCallback(() => {
        const location = pathName.substring(3);
        const newLocale = locale === "en" ? "ja" : "en";
        router.push(`/${newLocale}${location}`);
    }, [locale, pathName]);

    const handleKeys = useCallback((e: KeyboardEvent) => {
        if (!e.altKey) return;
        if (e.code === "KeyL") changeLocale();
    }, [changeLocale]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [handleKeys]);

    return (
        <button type="button" className="p-2 rounded-md bg-foreground" onClick={changeLocale}>
            <TranslateIcon weight={'bold'} />
        </button>
    );
};

export default ToggleLang;
