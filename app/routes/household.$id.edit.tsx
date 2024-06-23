import { LinksFunction, LoaderFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { useRef } from "react";
import invariant from "tiny-invariant";
import { checkHouseholdAdmin, editHousehold, getHousehold, getHouseholdUsers, getUser } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

import householdEditStylesheet from "../css/householdEdit.css?url";

export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: householdEditStylesheet }
    ];
};

export const meta: MetaFunction = () => {
    return [
        { title: "ShopMate" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    invariant(typeof params.id === "string", "wrong id type");
    const id = parseInt(params.id);

    const body = await request.formData();
    const name = body.get("name") as string;
    const color = body.get("color") as string;

    const response = await editHousehold(session.session_id, id, name, parseInt(color));

    return json({ response });
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    invariant(typeof params.id === "string", "wrong id type");
    const id = parseInt(params.id);

    const authorized = await checkHouseholdAdmin(session.session_id, id);
    if (!authorized) return redirect(`/household/${id}`);

    const account = await getUser(session.session_id);
    const household = await getHousehold(session.session_id, id);
    const members = await getHouseholdUsers(session.session_id, id);

    if (!household || !account || !members) return redirect(`/household/${id}`);

    return { household, account, members };
}

export default function EditHousehold() {
    const { household, account, members } = useLoaderData<typeof loader>();

    const colorSliderRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    const submit = useSubmit();

    return (
        <main>
            <Link className="backArrow" to={"/"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
            </Link>
            <h1>Edit Household</h1>
            <label htmlFor="name">Name: </label>
            <input ref={nameRef} type="text" name="name" id="name" maxLength={26} defaultValue={household.name} />
            <label htmlFor="colorSlider">Color: </label>
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
            <div>
                <h2>Members: </h2>
                <div id="members">
                    {members.map((member, index) => (
                        <div key={index}>
                            <div>{member.username}: </div>
                            <div>
                                <span>Permission: </span>
                                <select
                                    name="permission"
                                    id={`permission${index}`}
                                    onChange={(e) => {
                                        const formData = new FormData();
                                        formData.set("user_id", member.id);
                                        formData.set("permissions", e.target.value);
                                        submit(formData, {
                                            method: "post",
                                            action: `/household/${household.id}/set_permission`,
                                            navigate: false,
                                            unstable_flushSync: true,
                                        })
                                    }}
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button
                                onClick={() => {
                                    const formData = new FormData();
                                    formData.set("user_id", member.id);
                                    submit(formData, {
                                        method: "post",
                                        action: `/household/${household.id}/kick`,
                                        navigate: false,
                                        unstable_flushSync: true,
                                    })
                                }}
                            >
                                Kick
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <button
                id="save"
                onClick={() => {
                    const formData = new FormData();

                    formData.set("name", nameRef.current!.value);
                    formData.set("color", colorSliderRef.current!.value);

                    submit(formData, {
                        method: "post",
                        navigate: false,
                        unstable_flushSync: true,
                    })
                }}
            >
                Save
            </button>
        </main>
    )
}