export async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
    try {
        const res = await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`, { signal: AbortSignal.timeout(2000) });

        if (!res.ok) {
            return null;
        }

        const rawTxt = await res.text();

        const match = rawTxt.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);

        if (match) {
            const res = await fetch(match[1], { signal: AbortSignal.timeout(2000) });

            if (!res.ok) {
                return null;
            }
            return await res.arrayBuffer();

        }
        return null;
    } catch {
        return null;
    }
}