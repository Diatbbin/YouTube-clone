import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
    id?: string;
    uid?: string;
    filename?: string;
    status?: "processing" | "processed";
    title?: string;
    description?: string;
    thumbnailFilename?: string;
  }

async function uploadFileWithSignedUrl(videofile: File, thumbnailFile: File, title: string, description: string) {
    const response: any = await generateUploadUrl({
        fileExtension: videofile.name.split('.').pop(),
        thumbnailFileExtension: thumbnailFile.name.split('.').pop(),
        title: title,
        description: description,
    });

    // Upload the file via the signed url 
    const uploadVideoResult = await fetch(response?.data?.url, {
        method: 'PUT',
        body: videofile,
        headers: {
            'Content-Type': videofile.type,
        },
    });

    if (!uploadVideoResult.ok) {
        throw new Error(`Failed to upload file: ${videofile.name}. Status code: ${uploadVideoResult.status}`);
    }


    // Upload the thumbnail file via the signed url 
    const uploadThumbnailResult = await fetch(response?.data?.thumbnailUrl, {
        method: 'PUT',
        body: thumbnailFile,
        headers: {
            'Content-Type': thumbnailFile.type,
        },
    });

    if (!uploadThumbnailResult.ok) {
        throw new Error(`Failed to upload file: ${thumbnailFile.name}. Status code: ${uploadThumbnailResult.status}`);
    }
}

export async function uploadVideo(videoFile: File, thumbnailFile: File, title: string, description: string) {
    try {
        return uploadFileWithSignedUrl(videoFile, thumbnailFile, title, description);
    } catch (error) {
        throw new Error(`Failed to upload video: ${error}`);
    }
}

export async function getVideos() {
  const response = await getVideosFunction();
  return response.data as Video[] ?? []
}
