const isSameDay = (a, b) => {
    return new Date(a).toLocaleDateString() ===
        new Date(b).toLocaleDateString();
};

export default isSameDay;
