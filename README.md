# Video upload & playback platform


A full-stack video upload and playback demo: users sign in with Google, upload raw video and a thumbnail, a background worker transcodes the video with FFmpeg, and the app lists videos and users can watch the processed video from Google Cloud Storage

**Live site:** [web-client on Cloud Run](https://yt-web-client-296066166592.us-central1.run.app)

Hosted on **Google Cloud** (Cloud Run, GCS, Pub/Sub) with **Firebase** for Auth, Firestore, and Cloud Functions

---

## Home page

<img width="1466" height="826" alt="Screenshot 2026-04-22 at 11 53 00 PM" src="https://github.com/user-attachments/assets/6a71cffc-b4fa-47c8-97c9-4410c205faed" />

## Video playback page

<img width="1892" height="949" alt="Screenshot_6" src="https://github.com/user-attachments/assets/d7d191d0-8115-4d27-90d3-29ef73118e24" />

## Upload page

<img width="1469" height="830" alt="Screenshot 2026-04-22 at 11 53 13 PM" src="https://github.com/user-attachments/assets/add0d4b9-c7eb-4e3c-9056-6df71e104048" />

---

## Features

- **Browse** uploaded videos (metadata, thumbnails)
- **Watch** transcoded video (360p) in the browser
- **Sign in / sign out** with Google (Firebase Auth)
- **Upload** video and thumbnail (authenticated users only, direct upload to GCS via signed URLs)
- **Background processing** — raw uploads are transcoded (360p) via an Express service triggered through Pub/Sub

---

## Repository layout

| Path | Description |
|------|-------------|
| `web-client/` | Next.js web app |
| `api-service/` | Firebase Cloud Functions |
| `src/` | Express transcoding service (Pub/Sub → FFmpeg → GCS) |
| `shared/` | Shared TypeScript types (e.g. `Video`) |

