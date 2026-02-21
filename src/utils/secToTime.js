export default function secToTime(sec) {
    const h = String(Math.floor(sec / 3600) % 60).padStart(2, "0");
    const m = String(Math.floor(sec / 60) % 60).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return { h, m, s };
}
