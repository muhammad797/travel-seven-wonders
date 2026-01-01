import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In - Travel Seven Wonders",
  description: "Sign in to your Travel Seven Wonders account to manage your bookings and plan your next journey to the Seven Wonders of the World.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

