import { LoaderFunctionArgs } from "@remix-run/node";
import { setPermission } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

export const action = async ({ request, params }: LoaderFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    if (!params.id) return null;
    const id = parseInt(params.id);

    const body = await request.formData();
    const user_id = body.get("user_id") as string;
    const permission = body.get("permission") as string;

    const response = await setPermission(session.session_id, id, user_id, permission);

    return response;
}

export default function SetPermission() {
    return new Response("Not implemented", { status: 501 });
}