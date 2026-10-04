import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Nunito } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import SiteLoader from '@/components/SiteLoader'
import GauntletCursorLoader from '@/components/GauntletCursorLoader'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})



const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Saksham Ojha — Full-Stack & Applied AI Developer',
  description:
    'Portfolio of Saksham Ojha, a Full-Stack & Applied AI Developer from IIT Roorkee. Specializing in Go, React, TypeScript, LangChain, and AI-powered systems.',
  keywords: [
    'Saksham Ojha',
    'Full Stack Developer',
    'Applied AI Developer',
    'IIT Roorkee',
    'Go Developer',
    'React Developer',
    'TypeScript',
    'LangChain',
    'Portfolio',
  ],
  authors: [{ name: 'Saksham Ojha' }],
  creator: 'Saksham Ojha',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skx56.dev',
    title: 'Saksham Ojha — Full-Stack & Applied AI Developer',
    description:
      'Portfolio of Saksham Ojha, a Full-Stack & Applied AI Developer from IIT Roorkee.',
    siteName: 'Saksham Ojha Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saksham Ojha — Full-Stack & Applied AI Developer',
    description:
      'Portfolio of Saksham Ojha, a Full-Stack & Applied AI Developer from IIT Roorkee.',
    creator: '@skx56',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${nunito.variable} font-sans antialiased`}>
        <ThemeProvider>
          <GauntletCursorLoader />
          <SiteLoader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
