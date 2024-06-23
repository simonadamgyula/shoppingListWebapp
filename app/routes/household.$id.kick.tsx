import { ActionFunctionArgs } from "@remix-run/node";
import { kickMember } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    if (!params.id) return null;
    const id = parseInt(params.id);

    const body = await request.formData();
    const user_id = body.get("user_id") as string;

    const response = await kickMember(session.session_id, id, user_id);

    return response;
}

export default function KickFromHousehold() {
    return new Response("Not implemented", { status: 501 });
}