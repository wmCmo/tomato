import getOrdinalSuffix from "./getOrdinalSuffix";

const formatDateEn = (date) => {
    const d = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const suffix = getOrdinalSuffix(d);

    return `${month} ${d}${suffix}, ${year}`;
};

export default formatDateEn;
