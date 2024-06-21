interface Household {
    id: number,
    name: string,
}

interface ContextValue {
    household: Household,
    x: number,
    y: number,
}

interface Item {
    name: string,
    quantity: number,
    measurement: string,
}