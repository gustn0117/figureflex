import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '피규어플렉스 - FigureFlex',
  description: '피규어/가챠/굿즈 도매 주문 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
