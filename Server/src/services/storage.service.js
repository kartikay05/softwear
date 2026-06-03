import { ImageKit }  from '@imagekit/nodejs';
import config from '../config/config.js';

let client;

function getClient() {
    if (!config.IMAGEKIT_PUBLIC_KEY || !config.IMAGEKIT_PRIVATE_KEY || !config.IMAGEKIT_URL_ENDPOINT) {
        throw new Error("ImageKit credentials are not configured");
    }

    if (!client) {
        client = new ImageKit({
            publicKey: config.IMAGEKIT_PUBLIC_KEY,
            privateKey: config.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
        });
    }

    return client;
}

export async function uploadFile({buffer, fileName, folder="softwear"}){
    try{
        const imagekit = getClient();
        const response = await imagekit.files.upload({
            file: await ImageKit.toFile(buffer),
            fileName,
            folder
        });

        return response
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

export async function deleteFile(fileId){
    try{
        const imagekit = getClient();
        const response = await imagekit.files.delete(fileId);
        return response;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}
