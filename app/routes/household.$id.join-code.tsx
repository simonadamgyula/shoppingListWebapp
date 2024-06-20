import { ActionFunctionArgs, json } from "@remix-run/node";
import React from "react";
import invariant from "tiny-invariant";
import { getJoinCode } from "~/services/api.server";
import { authenticator } from "~/services/auth.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    invariant(typeof params.id === "string", "wrong id type");
    const id = parseInt(params.id);

    const sessionId = session.session_id;

    const joinCode = await getJoinCode(sessionId, id);

    return json({ joinCode });
}

export default function JoinCode() {
    return (<React.Fragment></React.Fragment>)
}