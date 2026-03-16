import type { Metadata } from 'next'
import './globals.css'
import StoreProvider from '@/components/StoreProvider'

export const metadata: Metadata = {
  title: '피규어플렉스 - FigureFlex',
  description: '피규어/가챠/굿즈 도매 주문 시스템',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body><StoreProvider>{children}</StoreProvider></body>
    </html>
  )
}
