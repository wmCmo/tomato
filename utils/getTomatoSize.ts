export default function getTomatoSize(maxNum: number, session: number) {
    const ratio = session / maxNum;
    return String(Math.ceil(ratio * 5) * 20);
}