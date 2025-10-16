import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
  description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
  keywords: 'ikigai, ikigai test, life purpose, ikigai meaning, what is ikigai, personality test, Japanese philosophy',
  authors: [{ name: 'Ikigain' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
    description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    url: 'https://www.ikigain.org',
    siteName: 'Ikigain',
    images: [
      {
        url: 'https://www.ikigain.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ikigai Test - Discover Your Life Purpose',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ikigai Test - Discover Your Life Purpose | Ikigain',
    description: 'Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights.',
    images: ['https://www.ikigain.org/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.ikigain.org" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-site-verification" content="your-google-verification-code" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}