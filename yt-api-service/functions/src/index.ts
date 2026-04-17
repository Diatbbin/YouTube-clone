import * as functions from "firebase-functions/v1";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/https";

initializeApp();

const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "raw-videos-db";
const thumbnailBucketName = "thumbnails-db";

const videoCollectionId = "videos";

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string,
}

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated"
    );
  }

  const auth = request.auth;
  const data = request.data;
  const title = String(data.title);
  const desc = String(data.description);
  const videoBucket = storage.bucket(rawVideoBucketName);
  const thumbnailBucket = storage.bucket(thumbnailBucketName);

  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;
  const thumbnailFileName =
      `${auth.uid}-${Date.now()}.${data.thumbnailFileExtension}`;

  const videoId = fileName.split(".")[0];

  await firestore.collection(videoCollectionId).doc(videoId).set({
    id: videoId,
    uid: auth.uid,
    title: title,
    description: desc,
    thumbnailFilename: thumbnailFileName,
  }, {merge: true});

  const [url] = await videoBucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000,
  });

  const [thumbnailUrl] =
    await thumbnailBucket.file(thumbnailFileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
    });

  return {url, fileName, thumbnailUrl};
});

export const getVideos = onCall({maxInstances: 1}, async () => {
  const snapshot =
    await firestore.collection(videoCollectionId).limit(10).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Video[];
});

