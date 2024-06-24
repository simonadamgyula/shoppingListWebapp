import { LinksFunction, LoaderFunctionArgs, MetaFunction, NodeOnDiskFile, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { editUser, getUser } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

import accountStylesheet from "../css/account.css?url";
import { useRef } from "react";

export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: accountStylesheet }
    ];
};

export const meta: MetaFunction = () => {
    return [
        { title: "ShopMate" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
    const image_request = request.clone();
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    let formData = await unstable_parseMultipartFormData(
        image_request,
        unstable_composeUploadHandlers(
            unstable_createFileUploadHandler({
                filter({ contentType }) {
                    return contentType.includes("image");
                },
                directory: "public/img",
                avoidFileConflicts: false,
                file({ filename }) {
                    return filename;
                },
                maxPartSize: 10 * 1024 * 1024,
            }),
            unstable_createMemoryUploadHandler(),
        ),
    );

    const account = await getUser(session.session_id);

    if (!account) return redirect("/login");

    let pfp = account.profile_picture;
    if (formData.has("file")) {
        pfp = `/img/${(formData.get("file") as NodeOnDiskFile).name}`;
    }

    let username = formData.get("username") as string || account.username;

    const result = await editUser(session.session_id, username, pfp);

    return json({ result });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    const account = await getUser(session.session_id);
    if (!account) return redirect("/login");

    return json({ account });
}

export default function Account() {
    const { account } = useLoaderData<typeof loader>();

    const inputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);

    const submit = useSubmit();

    function submitEdit() {
        const formData = new FormData();
        if (inputRef.current?.files && inputRef.current?.files[0]) formData.append("file", inputRef.current!.files![0]);
        formData.append("username", usernameRef.current!.value);

        submit(formData, {
            method: "POST",
            replace: true,
            encType: "multipart/form-data",
        });
    }

    return (
        <main>
            <Link className="backArrow" to={"/"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
            </Link>
            <h1>Account</h1>
            <label htmlFor="pfpSelect">
                <img ref={imageRef} className="pfp" src={account.profile_picture} alt="" />
                <input
                    ref={inputRef}
                    id="pfpSelect"
                    name="file"
                    type="file"
                    style={{ display: "none" }}
                    onChange={() => {
                        if (!inputRef.current?.files || !inputRef.current?.files[0]) return;

                        imageRef.current!.src = URL.createObjectURL(inputRef.current.files[0])

                        submitEdit();
                    }}
                />
            </label>
            <label htmlFor="usernameInput">
                Username:
                <input
                    ref={usernameRef}
                    id="usernameInput"
                    type="text"
                    defaultValue={account.username}
                    onBlur={() => {
                        submitEdit();
                    }} />
            </label>
            <div className="danger">
                <div>
                    <span>Log out from account: </span>
                    <button
                        onClick={() => {
                            window.location.href = "/logout";
                        }}
                    >
                        Log out
                    </button>
                </div>
                <div>
                    <span>Delete your account: </span>
                    <button>Delete</button>
                </div>
            </div>
        </main>
    );
}