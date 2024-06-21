export default function Item({ item }: { item: NotAddedItem }) {
    return (
        <div className="item">
            <div className="item-id">{item.id}</div>
            <div className="item-name">{item.name}</div>
        </div>
    )
}