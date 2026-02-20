function getOrdinalSuffix(n) {
    const lastTwo = n % 100;
    if (lastTwo >= 11 && lastTwo <= 13) return "th";

    const lastOne = n % 10;
    if (lastOne === 1) return "st";
    if (lastOne === 2) return "nd";
    if (lastOne === 3) return "rd";
    return "th";
}

export default getOrdinalSuffix;