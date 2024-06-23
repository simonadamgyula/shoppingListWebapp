import { useFetcher } from "@remix-run/react";
import React from "react";

export default function Context({ value, contextRef }: { value: ContextValue, contextRef: React.RefObject<HTMLDivElement> }) {
    const position = { top: value.y, left: value.x };

    const codeFetcher = useFetcher({ key: "joinCode-" + value.household.id })
    const leaveFetcher = useFetcher({ key: "leave-" + value.household.id })

    async function copyTextToClipboard(text: string) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }

    let joinCode: string | null = null;
    if (codeFetcher.data) {
        joinCode = (codeFetcher.data as { joinCode: string }).joinCode;
    }

    return (
        <div
            ref={contextRef}
            style={position}
            id="context"
        >
            <span
                id="contextEdit"
                onClick={() => {
                    window.location.href = `/household/${value.household.id}/edit`;
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                </svg>
                Edit
            </span>
            <span className="separator"></span>
            <span
                id="contextCode"
                onClick={() => {
                    console.log(!!codeFetcher.data);
                    if (codeFetcher.data) {
                        copyTextToClipboard((codeFetcher.data as { joinCode: string }).joinCode);
                        return;
                    }

                    const formData = new FormData();
                    codeFetcher.submit(formData, {
                        action: `/household/${value.household.id}/join_code`,
                        method: "post",
                    })
                }}
            >
                {!joinCode ? (
                    <React.Fragment>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                        </svg>
                        Join code
                    </React.Fragment>
                ) : ((codeFetcher.data as { joinCode: string }).joinCode)}
            </span>
            <span className="separator"></span>
            <span
                id="contextLeave"
                onClick={() => {
                    leaveFetcher.submit(null, {
                        action: `/household/${value.household.id}/leave`,
                        method: "post",
                        unstable_flushSync: true,
                    })
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                </svg>
                Leave
            </span>
        </div>
    );
}