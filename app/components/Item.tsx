export default function Item({ item }: { item: NotAddedItem }) {
    const image_src = item.src || `https://web.getbring.com/assets/images/items/${item.id.toLowerCase().replaceAll(/( |-)/g, "_")}.png`;

    return (
        <div className="item">
            <img src={image_src} alt={item.name} />
            <div className="item-name">{item.name}</div>
        </div>
    )
}