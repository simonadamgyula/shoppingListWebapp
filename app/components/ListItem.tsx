import { useSubmit } from "@remix-run/react";

export default function ListItem({ item, household }: { item: Item, household: Household }) {
    const image_src = item.image || `https://web.getbring.com/assets/images/items/${item.name.toLowerCase()[0]}.png`;

    const submit = useSubmit();

    return (
        <div
            className={`item ${item.bought ? "bought" : ""}`}
            onClick={() => {
                const formData = new FormData();
                formData.set("item", item.name);
                formData.set("bought", (!item.bought).toString());

                submit(formData, {
                    method: "post",
                    action: `/household/${household.id}/items/set_bought`,
                    navigate: false,
                    unstable_flushSync: true,
                });
            }}
        >
            <img src={image_src} alt={item.name} />
            <div className="item-name">{item.name}</div>
            <div className="item-quantity">{item.quantity}</div>
        </div>
    )
}