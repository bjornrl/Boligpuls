import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eiendom Trondheim — Nyhetsbrev om boligmarkedet',
  description:
    'Hei! Mitt navn er Martin Brandvik. Jeg jobber i Nordvik Bolig i Trondheim til vanlig. En del av arbeidshverdagen min er å holde folk oppdatert på boligmarkedet i Trondheim Nå kan du også, helt kostnadsfritt, få oppdateringer jevnlig. Om du ønsker kan du også sende inn en forespørsel på verdivurdering.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nb">
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F7F5', color: '#002D32' }}>
        {children}
      </body>
    </html>
  )
}
