export default function secToTime(sec) {
    const totalSeconds = Number(sec) || 0;
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor(totalSeconds / 60) % 60).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return { h, m, s };
}
