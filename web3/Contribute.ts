import { getDownloadURL, ref as sRef, uploadBytes, uploadBytesResumable } from "firebase/storage";
import moment from "moment";
import { getDatabase, ref, push, set } from 'firebase/database';

// xxx 
export function fakeHash() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export interface ImageText {
    simple: string,
    descriptive: string,
    verbose: string,
    overlyVerbose: string,
}

export class Contribute {
    public static async uploadImage(storage: any, imageAsFile: any, textData: ImageText, invokeCalback: () => void) {
        const hash = 'II' + fakeHash();
        const uuid = 'todo-uuid'

        const storageRef = sRef(storage, `content/${hash}`);

        // xxx switch for dif content here;
        const metadata = { contentType: 'image/jpeg' };

        const uploadTask = uploadBytesResumable(storageRef, imageAsFile, metadata);

        uploadTask.on('state_changed',
            (snapshot: any) => handleUploadProgress(snapshot),
            (error: any) => onErrorUploading(error),
            () => {

                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const data = {
                        date: moment().unix(),
                        hash,
                        contributor: uuid,
                        imageUrl: downloadURL,
                        textData,
                        earnedtokens: 10.00
                    }

                    DataController.uploadImage(hash, data);

                    invokeCalback();
                });
            }
        );

    }
}

class DataController {
    public static uploadImage(hash: string, data: any) {
        const db = getDatabase();
        const contributionRef = ref(db, 'contributions/' + hash)
        set(contributionRef, data);

        const contentRef = ref(db, 'content/imageAndText/' + hash)
        set(contentRef, data);
    }
}

const handleUploadProgress = (snapshot: any) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
        case 'paused':
            console.log('Upload is paused');
            break;
        case 'running':
            console.log('Upload is running');
            break;
    }
}

const onErrorUploading = (error: any) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
        case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
        case 'storage/canceled':
            // User canceled the upload
            break;

        // ...

        case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
    }
}


