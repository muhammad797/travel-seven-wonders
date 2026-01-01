import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EmailVerificationBanner from "@/components/email-verification-banner"
import BookingProgress from "@/components/booking-progress"
import { AuthProvider, BookingProvider } from "@/lib/contexts"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travel Seven Wonders - Book Your Dream Journey",
  description:
    "Book flights and hotels to visit the Seven Wonders of the World. Experience humanity's greatest monuments with seamless travel planning.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon.ico",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon.ico",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <BookingProvider>
            <Header />
            <BookingProgress />
            <EmailVerificationBanner />
            {children}
            <Footer />
          </BookingProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
