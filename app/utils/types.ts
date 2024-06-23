interface Household {
    id: number,
    name: string,
    color: number,
    members?: User[],
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
    image: string,
    bought?: boolean,
}

interface NotAddedItem {
    name: string,
    id: string,
    src?: string,
    other?: boolean
}

interface Section {
    name: string,
    items: NotAddedItem[]
}

interface User {
    username: string,
    profile_picture: string
}