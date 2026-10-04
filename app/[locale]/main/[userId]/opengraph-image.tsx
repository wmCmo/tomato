import AppLogo from '@/components/ui/AppLogo';
import fetchProfile from '@/queries/profile';
import { LocaleType, SITE_URL } from '@/types/Locale';
import { avatarToPng } from '@/utils/avatarToPng';
import { getDict } from '@/utils/getDict';
import { loadGoogleFont } from '@/utils/loadGoogleFonts';
import { readFile } from 'fs/promises';
import { ImageResponse } from 'next/og';
import { join } from 'path';

const fontDir = join(process.cwd(), "assets/fonts");

function StatCard({ title, color, num }: { title: string; color: string; num: number; }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: 'white', borderRadius: '2rem', borderColor: "#e2e8f0", borderWidth: "1px", color: "#45556c", padding: "1rem 2rem", minWidth: "12rem" }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            <p style={{ color, fontSize: "4rem", fontWeight: "bold", margin: 0 }}>{num}</p>
        </div>
    );
}

export default async function Image({ params }: { params: Promise<{ locale: LocaleType; userId: string; }>; }) {
    const baseUrl = new URL(process.env.NODE_ENV === "development" ? `http://localhost:${process.env.PORT}` : SITE_URL);

    const { locale, userId } = await params;
    const dict = await getDict(locale);
    const profile = await fetchProfile(userId);

    const bestStr = dict.profile.share.best;
    const harvestedStr = dict.profile.share.harvested;
    const thisWeekStr = dict.profile.share.thisWeek;

    const jaTxt = [dict.appName, bestStr, harvestedStr, thisWeekStr].join('');
    const [montserrat, montserratBold, montserratLight, zenMaruBold, avatar] = await Promise.all([
        readFile(join(fontDir, "Montserrat-Regular.ttf")),
        readFile(join(fontDir, "Montserrat-Bold.ttf")),
        readFile(join(fontDir, "Montserrat-Light.ttf")),
        loadGoogleFont("Zen Maru Gothic", 700, jaTxt),
        avatarToPng(profile?.avatar_url),
    ]);

    const studySessions = profile?.study_sessions ?? [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDay = new Date(today);
    startDay.setDate(today.getDate() - 6);

    const totalsByDay = new Map();

    for (const session of studySessions) {
        const edited = new Date(session.last_edited);
        edited.setHours(0, 0, 0, 0);
        if (edited < startDay) break;
        if (edited > today) continue;

        const key = edited.toLocaleDateString();
        const prev = totalsByDay.get(key) ?? 0;
        totalsByDay.set(key, prev + (session.sessions ?? 0));
    }

    const result = [];
    for (let offset = 6; offset >= 0; offset--) {
        const day = new Date(today);
        day.setDate(today.getDate() - offset);
        const key = day.toLocaleDateString();
        result.push(totalsByDay.get(key) ?? 0);
    }

    return new ImageResponse(
        <div style={{ display: "flex", fontFamily: "Montserrat, 'Zen Maru Gothic'", flexDirection: 'column', justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "#FAFAFA", padding: "2rem", gap: "5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-around", flexDirection: "row", width: "100%", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "2em" }}>
                    <img src={avatar ?? baseUrl + "/logo.svg"} alt="User avatar" style={{ borderRadius: "1000px", height: "200px", width: "200px" }} />
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", color: "#1d293d" }}>
                        <h1 style={{ margin: 0, fontWeight: "bold", fontSize: '4rem' }}>{profile?.nickname}</h1>
                        <h2 style={{ margin: 0, fontWeight: 300, fontSize: '2rem' }}>@{profile?.handle}</h2>
                    </div>
                </div>
                <div style={{ color: '#1d293d', display: "flex", backgroundColor: "white", padding: '1em 4em', borderRadius: "1000px" }}>
                    <AppLogo dict={dict} ratio={2.5} />
                </div>
            </div>
            <div style={{ display: "flex", gap: "2rem" }}>
                <StatCard title={harvestedStr} color='#FF9393' num={profile?.study_sessions.reduce((sum, session) => session.sessions + sum, 0) ?? 0} />
                <StatCard title={thisWeekStr} color='#FFC367' num={result.reduce((sum, day) => sum + day, 0)} />
                <StatCard title={bestStr} color='#88E0FF' num={Math.max(...(profile?.study_sessions.map(s => s.sessions) ?? [0]))} />
            </div>
        </div>, {
        fonts: [
            { name: "Montserrat", data: montserrat, weight: 400, style: "normal" },
            { name: "Montserrat", data: montserratBold, weight: 700, style: "normal" },
            { name: "Montserrat", data: montserratLight, weight: 300, style: "normal" },
            ...(zenMaruBold ? [{ name: "Zen Maru Gothic", data: zenMaruBold, weight: 700 as const, style: "normal" as const }] : [])
        ]
    }
    );
}
