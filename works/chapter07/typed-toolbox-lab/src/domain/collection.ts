export function firstOrDefault<T>(items: T[]): T | undefined {
    return items[0];
}

export function getProperty<T, K extends keyof T>(item: T, key: K): T[K] {
    return item[key];
}

export function lastOrDefault<T>(items: T[]): T | undefined {
    return items[items.length - 1];
}

export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
    return items.map((item) => item[key]);
}
