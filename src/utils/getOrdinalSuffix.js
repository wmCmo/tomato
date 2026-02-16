function getOrdinalSuffix(n) {
    if (n === 11 || n === 12 || n === 13) return "th";

    const j = n % 10;
    if (j === 1) return "st";
    if (j === 2) return "nd";
    if (j === 3) return "rd";
    return "th";
}

export default getOrdinalSuffix;