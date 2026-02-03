const formatDateEn = (date) => {
    const d = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const suffix = d % 10 === 1 && d !== 11
        ? "st"
        : d % 10 === 2 && d !== 12
        ? "nd"
        : d % 10 === 3 && d !== 13
        ? "rd"
        : "th";

    return `${month} ${d}${suffix}, ${year}`;
};

export default formatDateEn;
