import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { getHouseholds, getUser } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";
import { LinksFunction } from "@remix-run/node";
import HouseholdCard from "~/components/HouseholdCard";
import { useEffect, useRef, useState } from "react";
import Context from "~/components/Context";
import React from "react";

import indexStylesheet from "../css/index.css?url";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: indexStylesheet }];
};

export const meta: MetaFunction = () => {
    return [
        { title: "ShopMate" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const auth = await authenticator.isAuthenticated(request, {});

    if (!auth) return json({ user: null, households: null });

    const user = await getUser(auth.session_id);
    const households = await getHouseholds(auth.session_id);

    return json({ user, households });
}

export default function Index() {
    const { user, households } = useLoaderData<typeof loader>();

    const submit = useSubmit();

    const [householdContext, setHouseholdContext] = useState<ContextValue | null>(null);
    const contextRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (contextRef.current && !contextRef.current.contains(event.target as Node)) {
                setHouseholdContext(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [contextRef, setHouseholdContext]);

    return (
        <main>
            <h1 id="title">ShopMate</h1>
            <div id="householdsHeader">
                <h2 id="householdsHeaderTitle">Households</h2>
                <svg
                    id="addHousehold"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    onClick={() => {
                        window.location.href = "/household/add";
                    }}
                >
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                </svg>
            </div>
            <div id="households">
                {households ? (
                    households.map((household) => (
                        <HouseholdCard household={household} setContext={setHouseholdContext} key={household.id} />
                    ))

                ) : (
                    <p>{user ? "No households found" : "You are not logged in"}</p>
                )}
            </div>
            {user ? (
                <Link to="/logout" id="logoutLink">Logout</Link>
            ) : (
                <Link to="/login" id="loginLink">Login</Link>
            )}
            <p>{user?.username}</p>
            <img src={user?.profile_picture} alt="" />
            {householdContext ? (
                <Context
                    contextRef={contextRef}
                    value={householdContext}
                />
            ) : <React.Fragment></React.Fragment>}
        </main>
    );
}
