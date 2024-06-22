import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { createHousehold } from "~/services/api.server";
import invariant from "tiny-invariant";

import householdAddStylesheet from "../css/householdAdd.css?url";
import { useLoaderData } from "@remix-run/react";

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

    return success ? redirect("/") : redirect("/household/add")
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    return null;
}

export default function AddHousehold() {
    useLoaderData();

    return (
        <div id="addHousehold">
            <h1 id="title">Add a household</h1>
            <h2>Create a new household</h2>
            <form id="addHouseholdForm" action="/household/add" method="post">
                <input type="text" id="householdName" name="householdName" placeholder="Household name" />
                <button type="submit">Create Household</button>
            </form>
            <h2>Join an existing household</h2>
            <form id="joinHouseholdForm" action="/household/join" method="post">
                <input type="text" id="joinCode" name="joinCode" placeholder="Join code" />
                <button type="submit">Join Household</button>
            </form>
        </div>
    )
}