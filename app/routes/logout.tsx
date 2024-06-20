import { ActionFunctionArgs } from "@remix-run/node";
import React from "react";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: ActionFunctionArgs) => {
    await authenticator.logout(request, { redirectTo: "/" });
}

export default function Logout() {
    return (<React.Fragment></React.Fragment>)
}