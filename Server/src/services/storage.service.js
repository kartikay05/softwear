import { ImageKit }  from '@imagekit/nodejs';
import config from '../config/config.js';

const client = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
});

export async function uploadFile({buffer, fileName, folder="softwear"}){
    try{
        const response = await client.files.upload({
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
        const response = await client.deleteFile(fileId);
        return response;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}