import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { joinHousehold } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

export const action = async ({ request }: LoaderFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    const body = await request.formData();
    const joinCode = body.get("joinCode") as string;

    invariant(joinCode, "joinCode is required");

    const success = await joinHousehold(session.session_id, joinCode);

    return success ? redirect("/") : redirect("/household/add")
}

export default function JoinHousehold() {
    return new Response("Not implemented", { status: 501 });
}