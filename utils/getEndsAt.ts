export default function getEndsAt(sec: number) {
    return new Date(Date.now() + (sec * 1000)).toUTCString();
}