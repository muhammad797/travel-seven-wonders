import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account Settings - Travel Seven Wonders",
  description: "Manage your Travel Seven Wonders account settings, profile information, and notification preferences.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

