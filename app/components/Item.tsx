export default function Item({ item, setAddItem }: { item: NotAddedItem, setAddItem: (item: NotAddedItem) => void }) {
    const image_src = item.src || `https://web.getbring.com/assets/images/items/${item.id.toLowerCase().replaceAll(/( |-)/g, "_")}.png`;

    return (
        <div
            className="item"
            onClick={() => {
                setAddItem(item);
            }}
        >
            <img src={image_src} alt={item.name} />
            <div className="item-name">{item.name}</div>
        </div>
    )
}