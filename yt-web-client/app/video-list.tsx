"use client";

import { getVideos, type Video } from './firebase/function';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from './page.module.css';

const THUMBNAIL_BUCKET = "thumbnails-db";
const thumbnailPrefix = `https://storage.googleapis.com/${THUMBNAIL_BUCKET}/`

export default function VideoList() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchVideos = async () => {
          try {
            const data = await getVideos();
            if (!cancelled) setVideos(data);
          } catch (e: any) {
            console.error(e.message);
          } finally {
            if (!cancelled) setLoading(false);
          }
        };

        fetchVideos();
        return () => {
          cancelled = true;
        };
      }, []);

    return (
        <section className={styles.contentSection}>
            <div className={styles.contentHeader}>
                <h2 className={styles.contentTitle}>All videos</h2>
                <span className={styles.videoCount}>
                    {loading ? "" : `${videos.length} videos`}
                </span>
            </div>

            {loading && (
                <p className={styles.listLoading}>Loading videos…</p>
            )}

            {!loading && videos.length === 0 && (
                <p className={styles.listEmpty}>No videos yet.</p>
            )}

            {!loading && videos.length > 0 && (
                <div className={styles.videoList}>
                    {videos.map((video) => (
                        <Link
                            key={video.id}
                            href={`/watch?${new URLSearchParams({
                                v: video.filename ?? '',
                                title: video.title ?? '',
                                description: video.description ?? '',
                            }).toString()}`}
                            className={styles.videoCard}
                        >
                            <Image
                                src={thumbnailPrefix + video.thumbnailFilename}
                                alt={video.title ?? 'video thumbnail'}
                                width={200}
                                height={120}
                                className={styles.thumbnail}
                                unoptimized
                            />

                            <div className={styles.videoMetadata}>
                                <h3 className={styles.videoTitle}>{video.title}</h3>
                                <p className={styles.description}>{video.description}</p>
                                <span className={styles.status}>{video.status ?? 'processing'}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>  
    )
}
