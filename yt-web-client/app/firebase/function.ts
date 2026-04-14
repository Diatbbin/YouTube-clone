import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string  
  }

async function uploadFileWithSignedUrl(file: File) {
    const response: any = await generateUploadUrl({
        fileExtension: file.name.split('.').pop()
    });

    // Upload the file via the signed url 
    const uploadResult = await fetch(response?.data?.url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

    if (!uploadResult.ok) {
        throw new Error(`Failed to upload file: ${file.name}. Status code: ${uploadResult.status}`);
    }

    return uploadResult;
}

export async function uploadVideo(file: File) {
    try {
        return uploadFileWithSignedUrl(file);
    } catch (error) {
        throw new Error(`Failed to upload video: ${error}`);
    }
}

// export async function uploadThumbnail(file: File) {
//     try {
//         return uploadFileWithSignedUrl(file);
//     } catch (error) {
//         throw new Error(`Failed to upload thumbnail: ${error}`);
//     }
// }

export async function getVideos() {
  const response: any = await getVideosFunction();
  return (response.data as Video[]) ?? [];
}