import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { deleteAccount } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    const result = await deleteAccount(session.session_id);

    if (result) return redirect("/logout");
    return json({ result });
}

export default function DeleteAccount() {
    return new Response(null, { status: 404 });
}
