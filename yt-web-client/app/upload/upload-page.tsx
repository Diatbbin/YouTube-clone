'use client';

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadVideo } from "../firebase/function";
import styles from "./upload-page.module.css";

export default function UploadPage() {
    const router = useRouter()
    const [title, setTitle] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (videoFile: File, title: string, description: string) => {
        setIsUploading(true);

        try {
            await uploadVideo(videoFile, title, description);
            alert("File uploaded successfully");
            router.refresh();
        } catch (error) {
            alert(`Failed to upload file: ${error}`);
        } finally {
            setIsUploading(false);
        }
    }

    const onSubmitUpload = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim()) {
            alert("Please enter a title.");
            return;
        }
        
        if (!description.trim()) {
            alert("Please enter a description.");
            return;
        }
          
        if (!thumbnailFile) {
            alert("Please select a thumbnail.");
            return;
        }
          
        if (!videoFile) {
            alert("Please select a video file.");
            return;
        }

        await handleUpload(videoFile, title, description);
    }

    return (
        <main className={styles.page}>
            <h1 className={styles.heading}>Upload Video</h1>

            <form className={styles.form} onSubmit={onSubmitUpload}>
                <label className={styles.label}>
                    Title
                    <input 
                        className={styles.input}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                        required
                    />
                </label>

                <label className={styles.label}>
                    Description
                    <textarea 
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter video description"
                        required
                    />
                </label>

                <label className={styles.label}>
                    Thumbnail image
                    <input 
                        className={styles.input}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files?.item(0) ?? null)}
                        placeholder="Upload thumbnail image"
                        required
                    />

                    <span className={styles.fileName}>
                        Selected thumbnail: {thumbnailFile?.name ?? "No thumbnail selected"}
                    </span>
                </label>

                <label className={styles.label}>
                    Video file
                    <input 
                        className={styles.input}
                        type="file"
                        accept=".mov, video/quicktime, video/*"
                        onChange={(e) => setVideoFile(e.target.files?.item(0) ?? null)}
                        placeholder="Upload video file"
                        required
                    />

                    <span className={styles.fileName}>
                        Selected video: {videoFile?.name ?? "No video selected"}
                    </span>
                </label>

                <button 
                    className={styles.button} type="submit" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </main>
    )
}