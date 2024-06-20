import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "~/services/session.server";
import { authenticate } from "./api.server";
import invariant from "tiny-invariant";

interface SessionId {
    session_id: string;
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<SessionId>(sessionStorage);

authenticator.use(
    new FormStrategy(async ({ form }) => {
        let username = form.get("username") as string | null;
        let password = form.get("password") as string | null;

        invariant(typeof username === "string", "username must be a string");
        invariant(username.length > 0, "username must not be empty");

        invariant(typeof password === "string", "password must be a string");
        invariant(password.length > 0, "password must not be empty");

        let session_id: string | null = await authenticate(username, password);

        if (session_id) return { session_id };

        throw new Error("Invalid username or password");
    }),
    "user-pass"
);