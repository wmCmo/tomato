export function shallowEqual<T extends object>(a: T | undefined, b: T | undefined) {
    if (a === b) return true;
    if (!a || !b) return false;

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    for (const k of aKeys) {
        // @ts-expect-error index access
        if (a[k] !== b[k]) return false;
    }
    return true;
}