import { credential } from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import {Video} from "../shared/video";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();
const videoCollectionId = 'videos';
const MAX_RETRY_COUNT = 3;
const processingTimeout = 60 * 60 * 1000; // 1hr

export function setVideo(videoId: string, video: Video) {
    return firestore
        .collection(videoCollectionId)
        .doc(videoId)
        .set(video, { merge: true })
}

export async function isVideoNew(videoId: string) {
    const videoRef = firestore.collection(videoCollectionId).doc(videoId)
    const now = Date.now()

    return firestore.runTransaction(async (tx) => {
        const snapshot = await tx.get(videoRef);
        const video = (snapshot.data() as Video) ?? {};

        if (video.status === "processed") return false

        if (video.status === "processing") {
            const processingStartTime = video.processingStartTime ?? 0
            const isStale = now - processingStartTime > processingTimeout

            if (!isStale) return false
        }

        if ((video.retryCount ?? 0) >= MAX_RETRY_COUNT) return false

        tx.set(videoRef, {
            id: videoId,
            uid: videoId.split("-")[0],
            status: "processing",
            processingStartTime: now,
            lastStatusUpdateTime: now,
            retryCount: (video.retryCount ?? 0) + 1,
            error: null,
        }, { merge: true });

        return true
    })
}