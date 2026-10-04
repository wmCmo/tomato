import AppLogo from "@/components/ui/AppLogo";
import fetchProfile from "@/queries/profile";
import getRoomParticipants from "@/queries/roomParticipants";
import getRoomStatus from "@/queries/roomStatus";
import { LocaleType, SITE_URL } from "@/types/Locale";
import { avatarToPng } from "@/utils/avatarToPng";
import { getDict } from "@/utils/getDict";
import { loadGoogleFont } from "@/utils/loadGoogleFonts";
import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { join } from "path";

const fontDir = join(process.cwd(), 'assets/fonts');

type DesignEnum = "bg" | "text" | "accent";
type ColorType = Record<"pink" | "blue" | "yellow", Record<DesignEnum, string>>;

const colors: ColorType = {
    pink: {
        accent: "#C43C3C",
        bg: "#FF9393",
        text: "#6B1414",
    },
    yellow: {
        accent: "#A35F00",
        bg: "#FFC367",
        text: "#5C3A00",
    },
    blue: {
        accent: "#0B6E8F",
        bg: "#88E0FF",
        text: "#073A4D",
    }

};

export default async function Image({ params }: { params: Promise<{ locale: LocaleType; userId: string; }>; }) {
    const baseUrl = new URL(process.env.NODE_ENV === "development" ? `http://localhost:${process.env.PORT}` : SITE_URL);

    const { locale, userId } = await params;

    const dict = await getDict(locale);
    const jaTxtBold = [dict.rooms.preview.title, dict.rooms.preview.desc, dict.appName].join("");
    const jaTxt = [dict.rooms.preview.inRoom, dict.rooms.preview.inRoom, dict.rooms.preview.invitation].join("");

    const profile = await fetchProfile(userId);
    const participants = await getRoomParticipants(profile?.id ? profile.id : userId);
    const roomStatus = await getRoomStatus(profile?.id ? profile.id : userId);

    const [montserrat, montserratBold, zenMaruBold, zenMaru] = await Promise.all([
        readFile(join(fontDir, 'Montserrat-Regular.ttf')),
        readFile(join(fontDir, 'Montserrat-Bold.ttf')),
        loadGoogleFont("Zen Maru Gothic", 700, jaTxtBold),
        loadGoogleFont("Zen Maru Gothic", 500, jaTxt)
    ]);

    const pallete: Record<DesignEnum, string> = roomStatus?.status === 0
        ? colors.pink
        : roomStatus?.status === 1
            ? colors.yellow
            : roomStatus?.status === 2
                ? colors.blue
                : colors.pink;

    const memberAvatars = await Promise.all(
        ([{ joiner_id: profile?.id }, ...(participants ?? [])]).map(async (p) => {
            const avatarUrl = await fetchProfile(p.joiner_id);
            const avatar = await avatarToPng(avatarUrl?.avatar_url);
            return avatar ?? baseUrl + "/logo.svg";
        })
    );

    return new ImageResponse(
        <div style={{ display: "flex", flexDirection: "column", color: pallete.text, backgroundColor: pallete.bg, fontFamily: "Montserrat, 'Zen Maru Gothic'", height: "100%", width: "100%", padding: "3rem 4rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                <div style={{ fontSize: "1.5rem", borderRadius: "1000px", padding: "1rem 2rem", backgroundColor: "white", fontWeight: 500 }}>{dict.rooms.preview.invitation}</div>
                <AppLogo dict={dict} ratio={2} />
            </div>
            <h1 style={{ display: "flex", fontSize: "4rem", alignItems: "center", fontWeight: 700, maxWidth: "70%" }}>
                {profile?.nickname}{dict.rooms.preview.title}
            </h1>
            <h2 style={{ fontSize: "2rem" }}>{dict.rooms.preview.desc}</h2>
            <div style={{ display: "flex", gap: "-1rem", marginTop: "auto", alignItems: "center" }}>
                {memberAvatars.map(p => <img src={p} alt="Someone's avatar" style={{ width: "5rem", height: "5rem", borderRadius: "1000px", borderColor: "white", borderWidth: "0.5rem" }} />)}
                <div style={{ display: 'flex', fontSize: '1.5rem', marginLeft: '3rem' }}>{memberAvatars.length}{dict.rooms.preview.inRoom}</div>
            </div>

        </div>,
        {
            fonts: [
                { name: "Montserrat", data: montserrat, weight: 400, style: "normal" },
                { name: "Montserrat", data: montserratBold, weight: 700, style: "normal" },
                ...(zenMaruBold ? [{ name: "Zen Maru Gothic", weight: 700 as const, data: zenMaruBold, style: "normal" as const }] : []),
                ...(zenMaru ? [{ name: "Zen Maru Gothic", weight: 500 as const, data: zenMaru, style: "normal" as const }] : []),
            ]
        }
    );
}