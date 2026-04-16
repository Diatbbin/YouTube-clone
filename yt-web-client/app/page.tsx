import styles from './page.module.css';
import { getVideos } from './firebase/function';

import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
    const videos = await getVideos();

    return (
        <main className={styles.page}>
            <section className={styles.headerSection}>
                <h1 className={styles.heading}>Lastest uploads</h1>
                <p className={styles.subheading}>
                    Browse newly uploaded videos and jump straight into the ones you want to watch.
                </p>
            </section>
          
            <section className={styles.contentSection}>
                <div className={styles.contentHeader}>
                    <h2 className={styles.contentTitle}>All videos</h2>
                    <span className={styles.videoCount}>{videos.length} videos</span>
                </div>

                {videos.length > 0 && (
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
                                    src={'/thumbnail.png'}
                                    alt={video.title ?? 'video thumbnail'}
                                    width={200}
                                    height={120}
                                    className={styles.thumbnail}
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
        </main>
    )
}

export const revalidate = 30;