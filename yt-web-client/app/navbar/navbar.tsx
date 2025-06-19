'use client';

import Image from "next/image";
import Link from "next/link";

import Styles from "./navbar.module.css"
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";

export default function Navbar() {
    const [user,  setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <nav className={Styles.nav}>
            <Link href="/">
                <Image width={90} height={20}
                    src="/youtube-logo.svg" alt="Youtube logo" />
            </Link>
            {
                user && <Upload />
            }
            <SignIn user={user}/>
        </nav>

    );
}