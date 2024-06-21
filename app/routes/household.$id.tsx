import { LinksFunction, LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getHousehold, getItems } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

import householdStylesheet from "../css/household.css?url";
import SubList from "~/components/SubList";
import Catalog from "~/components/Catalog";
import { getCatalog } from "~/services/catalog.server";
import { useEffect, useRef, useState } from "react";
import AddItemModal from "~/components/AddItemModal";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: householdStylesheet }];
};

export const meta: MetaFunction = () => {
    return [
        { title: "ShopMate" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    invariant(typeof params.id === "string", "wrong id type");
    const id = parseInt(params.id);

    const household: Household | null = await getHousehold(session.session_id, id);
    if (!household) return redirect("/");

    const items: Item[] | null = await getItems(session.session_id, id);
    if (items === null) return redirect("/");

    const catalog = await getCatalog();

    return { household, items, catalog };
}

export default function Household() {
    const { household, items, catalog } = useLoaderData<typeof loader>();

    const [modalItem, setModalItem] = useState<NotAddedItem | null>(null);
    const modalRef = useRef<HTMLDivElement>();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setModalItem(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalRef, setModalItem]);

    return (
        <main>
            <h1>{household.name}</h1>
            <div id="items">
                <h2>To buy</h2>
                <div id="itemsInList">
                    {items.length !== 0 ? (items.map((item, index) => (
                        <div key={index} className="item">
                            <span>{item.name}</span>
                            <span>{item.quantity}</span>
                        </div>
                    ))) : (
                        <div id="noItems">No items in this household</div>
                    )}
                </div>
                <Catalog catalog={catalog} setAddItem={setModalItem} />
            </div>

            {modalItem && (
                <AddItemModal modalRef={modalRef} item={modalItem} modalController={setModalItem} household={household} />
            )}
        </main>
    )
}