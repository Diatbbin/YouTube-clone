"use client";
import styles from './watch.module.css';

import { useSearchParams } from 'next/navigation'

export default function Watch() {
    const videoPrefix = 'https://storage.googleapis.com/processed-videos-db/';
    const videoSrc = useSearchParams().get('v');
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
             
                  {selectedVideo && <video className={styles.videoPlayer} controls src={selectedVideo} />}
              </section>
            </main>
        </div>
    );
}