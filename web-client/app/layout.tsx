import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Navbar from './navbar/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Video Platform',
  description: 'Video Platform',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
