import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { leaveHousehold } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    invariant(typeof params.id === "string", "wrong id type");
    const id = parseInt(params.id);

    const success = await leaveHousehold(session.session_id, id);

    return json({ success });
}

export default function LeaveHousehold() {
    return new Response(null, { status: 404 });
}