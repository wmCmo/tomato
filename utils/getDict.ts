import { LocaleType } from "@/types/Locale";

const dictionaries = {
    en: () => import("@/dictionary/en").then((module) => module.default),
    ja: () => import("@/dictionary/ja").then((module) => module.default),
};

export const getDict = async (locale: LocaleType) => dictionaries[locale]();
