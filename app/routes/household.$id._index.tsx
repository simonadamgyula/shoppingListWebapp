import { LinksFunction, LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node"
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getHousehold, getHouseholdUsers, getItems, getUser } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";
import Catalog from "~/components/Catalog";
import { getCatalog, searchCatalog } from "~/services/catalog.server";
import { useEffect, useRef, useState } from "react";
import AddItemModal from "~/components/AddItemModal";
import ListItem from "~/components/ListItem";
import React from "react";
import { flushSync } from "react-dom";
import UserDisplay from "~/components/UserDisplay";
import Members from "~/components/Members";

import householdStylesheet from "../css/household.css?url";
import userDisplayStylesheet from "../css/userDisplay.css?url";
import membersStylesheet from "../css/householdMembers.css?url";

export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: householdStylesheet },
        { rel: "stylesheet", href: userDisplayStylesheet },
        { rel: "stylesheet", href: membersStylesheet },
    ];
};

export const meta: MetaFunction = () => {
    return [
        { title: "ShopMate" },

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

    const user = await getUser(session.session_id);
    const members = await getHouseholdUsers(session.session_id, id);

    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    const catalog = query ? searchCatalog(query) : getCatalog();

    return { household, items, catalog, user, members };
}

export default function Household() {
    const { household, items, catalog, user, members } = useLoaderData<typeof loader>();

    const [areBoughtItems, setAreBoughtItems] = useState(false);
    const addItemFetcher = useFetcher({ key: `addItem-${household.id}` });
    const forceHide = addItemFetcher.state === "loading" || addItemFetcher.state === "submitting";

    const [modalItem, setModalItem] = useState<NotAddedItem | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

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
            <UserDisplay user={user} />
            <div className="title">
                <h1>
                    <Link className="backArrow" to={"/"}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                        </svg>
                    </Link>
                    {household.name}
                </h1>
                <Members members={members} />
            </div>
            <div id="items">
                <h2>To buy</h2>
                <div id="itemsInList">
                    {items.length !== 0 ? (items.map((item, index) => {
                        if (item.bought) {
                            if (!areBoughtItems && !forceHide) setAreBoughtItems(true);
                            return null;
                        }
                        return <ListItem item={item} key={index} household={household} />
                    })) : (
                        <div id="noItems">No items in this household</div>
                    )}
                </div>
                {areBoughtItems &&
                    <React.Fragment>
                        <div className="boughtTitle">
                            <h3>Bought</h3>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                onClick={() => {
                                    addItemFetcher.submit(new FormData(), {
                                        method: "post",
                                        action: `/household/${household.id}/items/clear_bought`,
                                        navigate: false
                                    });
                                    setAreBoughtItems(false);
                                }}
                            >
                                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
                            </svg>
                        </div>
                        <div id="itemsInList">
                            {items.length !== 0 ? (items.map((item, index) => {
                                if (!item.bought) {
                                    return null;
                                }
                                return <ListItem item={item} key={index} household={household} />
                            })) : (
                                <div id="noItems">No items you bought</div>
                            )}
                        </div>
                    </React.Fragment>
                }
                <Catalog catalog={catalog} setAddItem={setModalItem} />
            </div>

            {modalItem && (
                <AddItemModal modalRef={modalRef} item={modalItem} modalController={setModalItem} household={household} />
            )}
        </main>
    )
}