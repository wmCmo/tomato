export type FlattenRelation<T, Key extends keyof NonNullable<T>> = T extends null
    ? null
    : Omit<NonNullable<T>, Key> & {
        [K in Key]: NonNullable<T>[K] extends (infer U)[] | null
        ? Exclude<U, null> | null
        : NonNullable<T>[K];
    };

export type IsAssignable<T, U> = [T] extends [U] ? true : false;