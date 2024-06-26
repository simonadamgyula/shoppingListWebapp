interface Household {
    id: number,
    name: string,
    color: number,
    members?: User[] | null,
}

interface ContextValue {
    household: Household,
    x: number,
    y: number,
}

interface Item {
    name: string,
    quantity: string,
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
    id: string,
    username: string,
    profile_picture: string,
    permission?: string
}