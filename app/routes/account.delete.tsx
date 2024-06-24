import { ActionFunctionArgs, json } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    const result = await deleteUser(session.session_id);

    return json({ result });

}

function deleteUser(session_id: string) {
    throw new Error("Function not implemented.");
}
