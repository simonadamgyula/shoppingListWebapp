import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { getHouseholds, getUser } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";
import { LinksFunction } from "@remix-run/node";

import indexStylesheet from "../css/index.css?url";
import HouseholdCard from "~/components/HouseholdCard";
import { useEffect, useRef, useState } from "react";
import Context from "~/components/Context";

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
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: MouseEvent) {
            if (contextRef.current && !contextRef.current.contains(event.target as Node)) {
                setHouseholdContext(null);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [contextRef, setHouseholdContext]);

    return (
        <main>
            <h1 id="title">ShopMate</h1>
            <h2 id="householdsHeader">Households</h2>
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
            {householdContext && (
                <Context
                    contextRef={contextRef}
                    value={householdContext}
                />
            )}
        </main>
    );
}
