export default function dateToSec(date: string, updated_at: string) {
    return Math.ceil((Date.parse(date) - Date.parse(updated_at)) / 1000);
}