import getOrdinalSuffix from "./getOrdinalSuffix";

function formatDateEnNoYear(date = new Date(), opts = {}) {
    const {
        weekdayLocale = 'en-US',
        timeLocale = undefined, //user's locale as default
        hour12 = false
    } = opts;
    const day = date.getDate();

    const suffix = getOrdinalSuffix(day);

    const weekday = new Intl.DateTimeFormat(weekdayLocale, {
        weekday: "short"
    }).format(date);

    const time = new Intl.DateTimeFormat(timeLocale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12
    }).format(date);

    return `${day}${suffix} (${weekday} - ${time})`;
}

export default formatDateEnNoYear;