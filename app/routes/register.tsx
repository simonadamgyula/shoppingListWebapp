import { ActionFunctionArgs, LoaderFunctionArgs, NodeOnDiskFile, TypedResponse, json, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { authenticator } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
    let formData = await unstable_parseMultipartFormData(
        request,
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
}


export default function Register() {
    const imageRef = useRef<HTMLImageElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    console.log("rerender")

    return (
        <main>
            <h1>Register</h1>

            <label>
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
            <img ref={imageRef} src="" alt="" />
            <Form
                ref={formRef}
                method="post"
                encType="multipart/form-data"
            >
                <input type="text" name="username" />
                <input type="password" name="password" />
                <input type="password" name="repassword" />
                <button
                    onClick={() => {
                        if (!inputRef.current?.files || !inputRef.current?.files[0]) return;
                        let formData = new FormData(formRef.current!);

                        if (formData.get("password") !== formData.get("repassword")) return;

                        formData.set("file", inputRef.current.files[0]);
                    }}
                >
                    Register
                </button>
            </Form>
        </main>
    );
}