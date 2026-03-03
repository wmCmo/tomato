import DictProvider from "@/providers/dict-provider";
import { LocaleArr, LocaleType } from "@/types/Locale";

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string; }>; }>) {
    const { locale: rawLocale } = await params;
    const locale: LocaleType = LocaleArr.includes(rawLocale as LocaleType) ? rawLocale as LocaleType : "en";
    return (
        <DictProvider locale={locale}>
            {children}
        </DictProvider>
    );
}
