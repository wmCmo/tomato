import fetchProfile from "@/queries/profile";
import { LocaleType } from "@/types/Locale";
import { getDict } from "@/utils/getDict";
import { Metadata } from "next";
import { ReactNode } from "react";

export async function generateMetadata({ params }: { params: Promise<{ userId: string, locale: string; }>; }): Promise<Metadata> {
    const { userId, locale } = await params;
    const [profile, dict] = await Promise.all([
        fetchProfile(userId),
        getDict(locale as LocaleType)
    ]);
    const userName = profile?.nickname ?? dict.profile.user;
    const displayName = `${userName}${dict.rooms.title}`;

    return {
        title: displayName,
        openGraph: {
            title: userName + dict.rooms.preview.title,
            description: dict.rooms.preview.desc,
        }
    };
}

export default function RoomsLayout({ children }: Readonly<{ children: ReactNode; }>) {
    return <>{children}</>;
}
