import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Entangled Memes - Super Bowl Demo',
  description: 'Experience quantum-entangled token pairs with dynamic trading',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-gray-100 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}