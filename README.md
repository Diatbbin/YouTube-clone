# Video upload & playback platform


A full-stack video upload and playback demo: users sign in with Google, upload raw video and a thumbnail, a background worker transcodes with FFmpeg, and the app lists videos and streams the processed file from Google Cloud Storage.

**Live site:** [yt-web-client on Cloud Run](https://yt-web-client-296066166592.us-central1.run.app)

Hosted on **Google Cloud** (Cloud Run, GCS, Pub/Sub) with **Firebase** for auth, Firestore, and Cloud Functions.

---

## Home page

<img width="1469" height="831" alt="Screenshot 2026-04-18 at 7 20 33 PM" src="https://github.com/user-attachments/assets/1f1ac3e3-5c19-4dc6-a484-066e1119c954" />

## Video playback page

<img width="1888" height="944" alt="Screenshot_37" src="https://github.com/user-attachments/assets/939c5ba7-bb90-4f73-8027-a81dc6a9077c" />

## Upload page

<img width="1466" height="823" alt="Screenshot 2026-04-18 at 7 21 53 PM" src="https://github.com/user-attachments/assets/6d86e1cc-27bb-4183-a680-e26404bb2fe6" />

---

## Features

- **Browse** uploaded videos (metadata, thumbnails, processing status)
- **Watch** transcoded video (360p) in the browser
- **Sign in / sign out** with Google (Firebase Auth)
- **Upload** video and thumbnail (authenticated users only; direct upload to GCS via signed URLs)
- **Background processing** — raw uploads are transcoded (e.g. 360p) via an Express service triggered through Pub/Sub

---

## Tech stack

| Area | Technologies |
|------|----------------|
| **Frontend** | TypeScript, Next.js (App Router) |
| **Video processing** | Node.js, Express.js, FFmpeg, Docker |
| **Auth & APIs** | Firebase Authentication, Firebase Cloud Functions (callable) |
| **Data** | Cloud Firestore, Google Cloud Storage |
| **Messaging & hosting** | Google Cloud Pub/Sub, Google Cloud Run |

---

## Repository layout

| Path | Description |
|------|-------------|
| `yt-web-client/` | Next.js web app |
| `yt-api-service/` | Firebase Cloud Functions |
| `src/` | Express transcoding service (Pub/Sub → FFmpeg → GCS) |
| `shared/` | Shared TypeScript types (e.g. `Video`) |

