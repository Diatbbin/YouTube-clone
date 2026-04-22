import styles from './page.module.css';
import VideoList from './video-list';

export const dynamic = "force-dynamic";

export default async function Home() {

    return (
        <main className={styles.page}>
            <section className={styles.headerSection}>
                <h1 className={styles.heading}>Latest uploads</h1>
                <p className={styles.subheading}>
                    Browse newly uploaded videos and jump straight into the ones you want to watch.
                </p>
            </section>
          
          
            <VideoList />
        </main>
    )
}
export const revalidate = 30;
