interface Household {
    id: number,
    name: string,
}

interface ContextValue {
    household: Household,
    x: number,
    y: number,
}