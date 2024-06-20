import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";

import householdAddStylesheet from "../css/householdAdd.css?url";
import { authenticator } from "~/services/auth.server";
import { createHousehold, joinHousehold } from "~/services/api.server";
import invariant from "tiny-invariant";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: householdAddStylesheet }];
};

export const meta: MetaFunction = () => {
    return [
        { title: "ShopMate" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    const body = await request.formData();
    const joinCode = body.get("joinCode") as string;

    invariant(joinCode, "joinCode is required");

    const success = await createHousehold(session.session_id, joinCode);

    return success ? redirect("/household") : redirect("/household/add")
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
}

export default function AddHousehold() {
    return (
        <main>
            <h1 id="title">ShopMate</h1>
            <form id="addHouseholdForm" action="/household/add" method="post">
                <label htmlFor="householdName">Household Name</label>
                <input type="text" id="householdName" name="householdName" />
                <button type="submit">Create Household</button>
            </form>
            <h2>Join</h2>
            <form id="joinHouseholdForm" action="/household/join" method="post">
                <label htmlFor="joinCode">Join Code</label>
                <input type="text" id="joinCode" name="joinCode" />
                <button type="submit">Join Household</button>
            </form>
        </main>
    )
}