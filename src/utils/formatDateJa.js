const formatDateJa = (date) => {
    const d = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const weekday = new Intl.DateTimeFormat("ja-JP", {
        weekday: "short",
    }).format(date);

    return `${year}年${month}月${d}日（${weekday}）`;
};

export default formatDateJa;
