const isSameDay = (a: string, b: string) => {
    return new Date(a).toLocaleDateString() ===
        new Date(b).toLocaleDateString();
};

export default isSameDay;
