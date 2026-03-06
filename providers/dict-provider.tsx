'use client';

import en from "@/dictionary/en";
import ja from "@/dictionary/ja";
import { DictType } from "@/types/DictType";
import { LocaleType } from "@/types/Locale";
import { createContext, useMemo } from "react";

const dictionaries: Record<LocaleType, DictType> = { en, ja };

export const DictContext = createContext<{ dict: DictType; locale: LocaleType; } | undefined>(undefined);

export default function DictProvider({ locale, children }: { locale: LocaleType; children: React.ReactNode; }) {
    const dict = useMemo(() => dictionaries[locale], [locale]);
    return (
        <DictContext.Provider value={{ dict, locale }}>
            {children}
        </DictContext.Provider>
    );
}
