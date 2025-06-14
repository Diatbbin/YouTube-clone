import Image from "next/image";
import Link from "next/link";
import Styles from "./navbar.module.css"

export default function Navbar() {
    return (
        <nav className={Styles.nav}>
            <Link href="/">
                <Image width={90} height={20}
                    src="/youtube-logo.svg" alt="Youtube logo" />
            </Link>
            
        </nav>
    );
}