import type { Metadata } from 'next'
import { Outfit, Playfair_Display } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Boligpuls Trondheim — Nyhetsbrev om boligmarkedet',
  description:
    'Hold deg oppdatert på boligmarkedet i Trondheim. Få nyhetsbrev segmentert etter bydel — prisvekst, nybygg og bydelsutvikling.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nb" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F6', color: '#1C1917' }}>
        {children}
      </body>
    </html>
  )
}
