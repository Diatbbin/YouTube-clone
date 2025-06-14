import { Storage } from '@google-cloud/storage'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import { raw } from 'express';
import { dir } from 'console';

const storage = new Storage();

const rawVideoBucketName = "raw-videos-db"
const processedVideoBucketName = "processed-videos-db"

const localRawVideoPath = "./raw-vdeos-db"
const localProcessedVideoPath = "./processed-videos-db"

/**
 * Create local dir for raw and process vid
 */
export function setUpDirectories() {
    ensureDirExists(localRawVideoPath)
    ensureDirExists(localProcessedVideoPath)
}

/**
 * Ensures that the directory exists, if it doesnt exist, create it
 * @param dirPath - The dir path to be checked
 */
function ensureDirExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true})
        console.log(`Directory created at ${dirPath}`)
    }
}

/**
 * 
 * @param rawVideoName - The name of the file to be converted from {@link localRawVideoPath}
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}
 * @returns A promise that resolves when the video has been converted
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    // Process the video with ffmpeg
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions('-vf', 'scale=-1:360')
        .on('end', function() {
            console.log('Processing completed');
            resolve();
        })
        .on('error', function(err) {
            console.error('Error: ' + err.message);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    })
}

/**
 * 
 * @param filename - The name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder
 * @returns A promise that resolves when the video has been downloaded
 */
export async function downloadRawVideo(filename: string) {
    await storage.bucket(rawVideoBucketName)
        .file(filename)
        .download({
            destination: `${localRawVideoPath}/${filename}`
        })
        
    console.log(
        `gs://${rawVideoBucketName}/${filename} downloaded to ${localRawVideoPath}/${filename}`
    )    
}

/**
 * 
 * @param filename - The name of the file to upload from the 
 * {@link localProcessedVideoPath} bucket into the {@link processedVideoBucketName} folder
 * @returns A promise that resolves when the video has been uploaded
 */
export async function uploadProcessedVideo(filename: string) {
    const bucket = storage.bucket(processedVideoBucketName)
    
    await storage.bucket(processedVideoBucketName)
        .upload(`${localProcessedVideoPath}/${filename}`, {
            destination:  filename
        });
        
    console.log(
        `${localProcessedVideoPath}/${filename} downloaded to gs://${processedVideoBucketName}/${filename}`
    )    

    await bucket.file(filename).makePublic()
}

/**
 * 
 * @param filename - The name of the file to be deleted from localRawVideoPath folder
 * @returns A promise that resolves when the file has been deleted
 */
export function deleteProcessedVideo(filename: string) {
    return deleteFile(`${localProcessedVideoPath}/${filename}`)
}

/**
 * 
 * @param filename - The name of the file to be deleted from localRawVideoPath folder
 * @returns A promise that resolves when the file has been deleted
 */
export function deleteRawVideo(filename: string) {
    return deleteFile(`${localRawVideoPath}/${filename}`)
}

/**
 * 
 * @param filePath  - The path of the file to be deleted
 * @returns A promise that resolves when the file has been deleted
 */
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // if the file doesnt exist
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err)=> {
                if(err) {
                    console.log(`Failed to delete file at ${filePath}`, err);
                    reject(err)
                } else {
                    console.log(`File deleted st ${filePath}`)
                    resolve();
                }
            });
        } else {
            console.log(`File not found at ${filePath} skipping details.`);
            resolve();
        }
    })
}