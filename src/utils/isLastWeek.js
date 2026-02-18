const isLastWeek = (date) => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    return date >= lastWeek && date <= today;
};

export default isLastWeek;
