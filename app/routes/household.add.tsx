import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { createHousehold } from "~/services/api.server";
import invariant from "tiny-invariant";

import householdAddStylesheet from "../css/householdAdd.css?url";
import { Link, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import Household from "./household.$id";

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
    const household = body.get("householdName") as string;
    const color = body.get("color") as string;

    invariant(household, "joinCode is required");

    const success = await createHousehold(session.session_id, household, parseInt(color));

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

    const colorSliderRef = useRef<HTMLInputElement>(null);

    return (
        <div id="addHousehold">
            <Link className="backArrow" to={"/"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
            </Link>
            <h1 id="title">Add a household</h1>
            <h2>Create a new household</h2>
            <form id="addHouseholdForm" action="/household/add" method="post">
                <input type="text" id="householdName" name="householdName" placeholder="Household name" />
                <input
                    ref={colorSliderRef}
                    type="range"
                    name="color"
                    id="colorSlider"
                    min={0}
                    max={360}
                    defaultValue={0}
                    onChange={() => {
                        colorSliderRef.current!.style.setProperty("--hue", colorSliderRef.current!.value)
                    }} />
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