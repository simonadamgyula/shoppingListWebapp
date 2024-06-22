import { useRef } from "react";
import SubList from "./SubList";
import { useSearchParams } from "@remix-run/react";
import Item from "./Item";

export default function Catalog({ catalog, setAddItem }: { catalog: Section[], setAddItem: (item: NotAddedItem) => void }) {
    const searchRef = useRef<HTMLInputElement>(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get("query");
    const otherItem = query && {
        name: query,
        id: query.toLowerCase().replaceAll(/( |-)/g, "_"),
        src: `https://web.getbring.com/assets/images/items/${query.toLowerCase()[0]}.png`
    };

    return (
        <div id="itemList">
            <div id="searchBar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
                <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search for an item"
                    onChange={() => {
                        const params = new URLSearchParams();
                        if (!searchRef.current) return;
                        params.set("query", searchRef.current.value);
                        setSearchParams(params, {
                            preventScrollReset: true,
                            replace: true,
                        });
                    }}
                />
            </div>
            {catalog.map((section, index) => {
                return <SubList index={index} key={index} name={section.name} items={section.items} setAddItem={setAddItem} />;
            })}
            {otherItem &&
                <Item setAddItem={setAddItem} item={otherItem} />
            }
        </div>
    )
}