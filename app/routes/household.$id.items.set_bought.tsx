import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { itemSetBought } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
    invariant(typeof params.id === "string", "wrong id type");

    const body = await request.formData();

    const item = body.get("item") as string;
    const bought = (body.get("bought") as string) === "true";

    const response = await itemSetBought(session.session_id, parseInt(params.id), item, bought);

    return json({ response });
}

export default function SetBought() {
    return new Response("Not implemented", { status: 501 });
}