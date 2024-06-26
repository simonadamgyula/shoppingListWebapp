import { useSubmit } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

export default function AddItemModal({ modalRef, item, household, modalController }: { modalRef: React.RefObject<HTMLDivElement>, item: NotAddedItem, household: Household, modalController: (item: NotAddedItem | null) => void }) {
    const image_src = item.src || `https://web.getbring.com/assets/images/items/${item.id.toLowerCase().replaceAll(/( |-)/g, "_")}.png`;

    const quantityRef = useRef<HTMLInputElement>(null);
    const submit = useSubmit();

    return (
        <div id="addItemModal" ref={modalRef}>
            <h2>Add <span className="addItemItem">{item.name}</span> to shopping list</h2>
            <img
                src={image_src}
                alt={item.name}
            />
            <input ref={quantityRef} type="text" placeholder="Quantity" />
            <div className="modalButtons">
                <button
                    onClick={() => {
                        if (quantityRef.current?.value) {
                            const formData = new FormData();
                            formData.set("quantity", quantityRef.current.value);
                            formData.set("item", item.name);
                            formData.set("image", image_src);

                            submit(formData, {
                                method: "post",
                                action: `/household/${household.id}/items/add`,
                                navigate: false,
                                unstable_flushSync: true,
                            });
                        }
                        modalController(null);
                    }}
                >
                    Add
                </button>
                <button
                    className="cancel"
                    onClick={() => {
                        modalController(null);
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}