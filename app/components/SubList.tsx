import { useState } from "react";
import Item from "./Item";

export default function SubList({ name, items, setAddItem }: { name: string, items: NotAddedItem[], setAddItem: (item: NotAddedItem) => void }) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className="subList">
            <div
                className="subListTitle"
                onClick={() => setOpen(!open)}
            >
                <h3>{name}</h3>
                {open ?
                    (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                        </svg>
                    ) :
                    (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                        </svg>
                    )
                }
            </div>
            {open && (
                <div className="items">
                    {items.map((item, index) => {
                        return <Item key={index} item={item} setAddItem={setAddItem} />
                    })}
                </div>
            )}
        </div >
    )
}