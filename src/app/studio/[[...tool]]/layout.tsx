export const metadata = {
  title: 'Sanity Studio — Boligpuls Trondheim',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
