export default function ListItem({ item }: { item: Item }) {
    const image_src = "https://web.getbring.com/assets/images/items/k.png";

    return (
        <div
            className="item"
        >
            <img src={image_src} alt={item.name} />
            <div className="item-name">{item.name}</div>
            <div className="item-quantity">{item.quantity} {item.measurement}</div>
        </div>
    )
}