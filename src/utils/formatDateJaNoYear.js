function formatDateJaNoYear(date = new Date(), opts = {}) {
    const {
        weekdayLocale = "ja-JP",
        timeLocale = undefined, //user's locale as default
        hour12 = false,
    } = opts;
    const day = date.getDate();

    const weekday = new Intl.DateTimeFormat(weekdayLocale, {
        weekday: "short",
    }).format(date);

    const time = new Intl.DateTimeFormat(timeLocale, {
        hour: "numeric",
        minute: "2-digit",
        hour12,
    }).format(date);

    return `${day}日（${weekday}）ー${time}`;
}

export default formatDateJaNoYear;
