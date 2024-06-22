import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { addItem } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
    invariant(typeof params.id === "string", "wrong id type");

    const body = await request.formData();

    const item = body.get("item") as string;
    const quantityStr = body.get("quantity") as string;
    const image = body.get("image") as string;
    invariant(item, "item is required");
    invariant(quantityStr, "quantity is required");

    console.log(image)

    const quantity = parseInt(quantityStr.split(" ")[0]);
    const measurement = quantityStr.split(" ")[1];


    const response = await addItem(session.session_id, parseInt(params.id), { name: item, quantity: quantity, measurement, image });

    return json({ response });
}

export default function HouseholdAddItem() {
    return new Response("Not implemented", { status: 501 });
}