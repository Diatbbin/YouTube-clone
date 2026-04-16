"use client";
import styles from './watch.module.css';

import { useSearchParams } from 'next/navigation'

export default function Watch() {
    const videoPrefix = 'https://storage.googleapis.com/processed-videos-db/';
    const searchParams = useSearchParams();
    const videoSrc = searchParams.get('v');
    const title = searchParams.get('title')
    const description = searchParams.get('description')
    const selectedVideo = videoPrefix + videoSrc

    return (
        <div>
            <main className={styles.watchPage}>
              <section className={styles.headerSection}>
                  <h1 className={styles.heading}>Watch video</h1>
                  <p className={styles.subheading}>Stream your selected video!</p>
              </section>

              <section className={styles.playerSection}>
                  <h2 className={styles.playerTitle}>Now playing</h2>
                  <h3 className={styles.videoTitle}>{title}</h3>
                  <p className={styles.videoDescription}>{description}</p>
             
                  {selectedVideo && <video className={styles.videoPlayer} controls src={selectedVideo} />}
              </section>
            </main>
        </div>
    );
}