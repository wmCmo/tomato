import fetchProfile from "@/queries/profile";
import { LocaleType } from "@/types/Locale";
import { getDict } from "@/utils/getDict";
import { ReactNode } from "react";

export async function generateMetadata({ params }: { params: Promise<{ userId: string, locale: string; }>; }) {
    const { userId, locale } = await params;
    const [profile, dict] = await Promise.all([
        fetchProfile(userId),
        getDict(locale as LocaleType)
    ]);

    const displayName = `${profile.nickname}${dict.rooms.title}`;

    return {
        title: displayName
    };
}

export default function RoomsLayout({ children }: { children: ReactNode; }) {
    return <>{children}</>;
}
