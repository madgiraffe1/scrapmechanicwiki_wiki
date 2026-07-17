import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const adsenseId =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID ||
  process.env.NEXT_PUBLIC_ADSENSE_ID ||
  ''

export const metadata: Metadata = adsenseId
  ? {
      other: {
        'google-adsense-account': adsenseId,
      },
    }
  : {}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
			<body suppressHydrationWarning className="antialiased">
				{adsenseId && (
					<Script
						async
						src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
						crossOrigin="anonymous"
						strategy="lazyOnload"
					/>
				)}
				{children}
			</body>
		</html>
	)
}
