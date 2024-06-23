import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, MetaFunction, NodeOnDiskFile, TypedResponse, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, Link, useFetcher, useSubmit } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { register } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";

import registerStylesheet from "../css/register.css?url";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: registerStylesheet }];
};

export const meta: MetaFunction = () => {
    return [
        { title: "ShopMate" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export async function action({ request }: ActionFunctionArgs) {
    const image_request = request.clone();
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

    let file = formData.get("file") as NodeOnDiskFile;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const repassword = formData.get("repassword") as string;

    if (password !== repassword) return new Response(null, { status: 400 });

    const result = await register(username, password, `/img/${file.name}`);
    if (!result) return new Response(null, { status: 400 });

    let user = await authenticator.authenticate("user-pass", request, {
        failureRedirect: "/login",
    });

    let session = await getSession(request.headers.get("cookie"));
    session.set(authenticator.sessionKey, user);

    let headers = new Headers({ "Set-Cookie": await commitSession(session) });
    return redirect("/", { headers });
}


export default function Register() {
    const imageRef = useRef<HTMLImageElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const submit = useSubmit();

    return (
        <main>
            <Link className="backArrow" to={"/"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
            </Link>

            <h1>Register</h1>

            <label id="profile_pic">
                <img ref={imageRef} src="/img/placeholder.png" alt="" />
                <input
                    ref={inputRef}
                    name="file"
                    type="file"
                    style={{ display: "none" }}
                    onChange={() => {
                        console.log("here");

                        if (!inputRef.current?.files || !inputRef.current?.files[0]) return;

                        imageRef.current!.src = URL.createObjectURL(inputRef.current.files[0])
                    }}
                />
            </label>
            <Form
                ref={formRef}
                method="post"
                encType="multipart/form-data"
            >
                <input type="text" name="username" placeholder="Username" />
                <input type="password" name="password" placeholder="Password" />
                <input type="password" name="repassword" placeholder="Confirm password" />
                <button
                    onClick={(e) => {
                        e.preventDefault();

                        if (!inputRef.current?.files || !inputRef.current?.files[0]) return;
                        let formData = new FormData(formRef.current!);

                        if (formData.get("password") !== formData.get("repassword")) return;

                        formData.set("file", inputRef.current.files[0]);

                        submit(formData, {
                            method: "post",
                            encType: "multipart/form-data",
                        });
                    }}
                >
                    Register
                </button>
                <p>Already have an account? <Link to={"/login"}>Log in</Link></p>
            </Form>
        </main>
    );
}