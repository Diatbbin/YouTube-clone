"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVideo = setVideo;
exports.isVideoNew = isVideoNew;
const firebase_admin_1 = require("firebase-admin");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
(0, app_1.initializeApp)({ credential: firebase_admin_1.credential.applicationDefault() });
const firestore = new firestore_1.Firestore();
const videoCollectionId = 'videos';
async function getVideo(videoId) {
    const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
    return snapshot.data() ?? {};
}
function setVideo(videoId, video) {
    firestore
        .collection(videoCollectionId)
        .doc(videoId)
        .set(video, { merge: true });
}
async function isVideoNew(videoId) {
    const video = await getVideo(videoId);
    return video?.status === undefined;
}
