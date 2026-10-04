
export async function avatarToPng(url: string | null | undefined): Promise<string | null> {
    if (!url) return null;
    try {
        const sharp = (await import("sharp")).default;

        const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
        if (!res.ok) return null;

        const img = await res.arrayBuffer();
        const buf = await sharp(img).resize(256, 256).png().toBuffer();
        return `data:image/png;base64,${buf.toString("base64")}`;
    } catch {
        return null;
    }
}