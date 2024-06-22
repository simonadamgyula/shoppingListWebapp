import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getItems, removeItem } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
    invariant(typeof params.id === "string", "wrong id type");

    const items = await getItems(session.session_id, parseInt(params.id));

    const response = items?.every(async (item) => {
        if (!params.id || !item.bought) return;
        return await removeItem(session.session_id, parseInt(params.id), item);
    });

    return json({ response });
}

export default function HouseholdCreateBought() {
    return new Error("Not implemented");
}