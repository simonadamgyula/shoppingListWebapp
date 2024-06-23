import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";
import type { LinksFunction } from "@remix-run/node";

import loginStylesheet from "../css/login.css?url";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: loginStylesheet },
];

export async function action({ request }: ActionFunctionArgs) {
    let user = await authenticator.authenticate("user-pass", request, {
        failureRedirect: "/login",
    });

    let session = await getSession(request.headers.get("cookie"));
    session.set(authenticator.sessionKey, user);

    let headers = new Headers({ "Set-Cookie": await commitSession(session) });
    return redirect("/", { headers });
};

export async function loader({ request }: LoaderFunctionArgs) {
    await authenticator.isAuthenticated(request, {
        successRedirect: "/",
    });

    let session = await getSession(request.headers.get("cookie"));
    let error = session.get(authenticator.sessionErrorKey);

    return json({ error }, {
        headers: {
            'Set-Cookie': await commitSession(session) // You must commit the session whenever you read a flash
        }
    });
};

export default function Login() {
    const { error } = useLoaderData<typeof loader>();
    console.log(error);

    return (
        <Form
            action="/login"
            method="post"
            autoComplete="new-password"
        >
            <h1>Log in</h1>
            <input type="text" name="username" id="usernameInput" autoComplete="nope" />
            <input type="password" name="password" id="passwordInput" autoComplete="nope" />
            <button type="submit">Log in</button>
        </Form>
    )
}