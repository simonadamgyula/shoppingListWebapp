import { ActionFunctionArgs, NodeOnDiskFile, json, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
    let formData = await unstable_parseMultipartFormData(
        request,
        unstable_composeUploadHandlers(
            unstable_createFileUploadHandler({
                filter({ contentType }) {
                    return contentType.includes("image");
                },
                directory: "public/img",
                avoidFileConflicts: false,
                file({ filename }) {
                    return filename;
                },
                maxPartSize: 10 * 1024 * 1024,
            }),
            unstable_createMemoryUploadHandler(),
        ),
    );

    let file = formData.get("file") as NodeOnDiskFile;
    return json({
        file: { name: file.name, url: `/img/${file.name}` },
    });
}

export default function UploadFile() {
    return new Response(null, { status: 404 });
}