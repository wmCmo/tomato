import { LocaleType } from "@/types/Locale";
import { getDict } from "@/utils/getDict";
import { ReactNode } from "react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; }>; }) {
    const { locale } = await params;
    const [dict] = await Promise.all([
        getDict(locale as LocaleType)
    ]);

    return { title: dict.setting.title };
}

export default function SettingsLayout({ children }: { children: ReactNode; }) {
    return <>{children}</>;
}