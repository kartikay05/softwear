import ImageKit, { toFile } from "@imagekit/nodejs";
import config from "../config/config.js";
import ApiError from "../utils/apiError.js";

let client;

function getClient() {
    if (!config.IMAGEKIT_PRIVATE_KEY) {
        throw new ApiError(503, "Image upload service is not configured");
    }

    if (!client) {
        client = new ImageKit({
            privateKey: config.IMAGEKIT_PRIVATE_KEY,
        });
    }

    return client;
}

export async function uploadFile({ buffer, fileName, folder = "softwear" }) {
    const imagekit = getClient();

    return imagekit.files.upload({
        file: await toFile(buffer, fileName),
        fileName,
        folder,
    });
}

export async function deleteFile(fileId) {
    if (!fileId) return;
    const imagekit = getClient();
    return imagekit.files.delete(fileId);
}
