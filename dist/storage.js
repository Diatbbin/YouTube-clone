"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpDirectories = setUpDirectories;
exports.convertVideo = convertVideo;
exports.downloadRawVideo = downloadRawVideo;
exports.uploadProcessedVideo = uploadProcessedVideo;
exports.deleteProcessedVideo = deleteProcessedVideo;
exports.deleteRawVideo = deleteRawVideo;
const storage_1 = require("@google-cloud/storage");
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const storage = new storage_1.Storage();
const rawVideoBucketName = "raw-videos-db";
const processedVideoBucketName = "processed-videos-db";
const localRawVideoPath = "./raw-vdeos-db";
const localProcessedVideoPath = "./processed-videos-db";
/**
 * Create local dir for raw and process vid
 */
function setUpDirectories() {
    ensureDirExists(localRawVideoPath);
    ensureDirExists(localProcessedVideoPath);
}
/**
 * Ensures that the directory exists, if it doesnt exist, create it
 * @param dirPath - The dir path to be checked
 */
function ensureDirExists(dirPath) {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created at ${dirPath}`);
    }
}
/**
 *
 * @param rawVideoName - The name of the file to be converted from {@link localRawVideoPath}
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}
 * @returns A promise that resolves when the video has been converted
 */
function convertVideo(rawVideoName, processedVideoName) {
    // Process the video with ffmpeg
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions('-vf', 'scale=-1:360')
            .on('end', function () {
            console.log('Processing completed');
            resolve();
        })
            .on('error', function (err) {
            console.error('Error: ' + err.message);
            reject(err);
        })
            .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}
/**
 *
 * @param filename - The name of the file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder
 * @returns A promise that resolves when the video has been downloaded
 */
async function downloadRawVideo(filename) {
    await storage.bucket(rawVideoBucketName)
        .file(filename)
        .download({
        destination: `${localRawVideoPath}/${filename}`
    });
    console.log(`gs://${rawVideoBucketName}/${filename} downloaded to ${localRawVideoPath}/${filename}`);
}
/**
 *
 * @param filename - The name of the file to upload from the
 * {@link localProcessedVideoPath} bucket into the {@link processedVideoBucketName} folder
 * @returns A promise that resolves when the video has been uploaded
 */
async function uploadProcessedVideo(filename) {
    const bucket = storage.bucket(processedVideoBucketName);
    await storage.bucket(processedVideoBucketName)
        .upload(`${localProcessedVideoPath}/${filename}`, {
        destination: filename
    });
    console.log(`${localProcessedVideoPath}/${filename} downloaded to gs://${processedVideoBucketName}/${filename}`);
    await bucket.file(filename).makePublic();
}
/**
 *
 * @param filename - The name of the file to be deleted from localRawVideoPath folder
 * @returns A promise that resolves when the file has been deleted
 */
function deleteProcessedVideo(filename) {
    return deleteFile(`${localProcessedVideoPath}/${filename}`);
}
/**
 *
 * @param filename - The name of the file to be deleted from localRawVideoPath folder
 * @returns A promise that resolves when the file has been deleted
 */
function deleteRawVideo(filename) {
    return deleteFile(`${localRawVideoPath}/${filename}`);
}
/**
 *
 * @param filePath  - The path of the file to be deleted
 * @returns A promise that resolves when the file has been deleted
 */
function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        // if the file doesnt exist
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                }
                else {
                    console.log(`File deleted st ${filePath}`);
                    resolve();
                }
            });
        }
        else {
            console.log(`File not found at ${filePath} skipping details.`);
            resolve();
        }
    });
}
