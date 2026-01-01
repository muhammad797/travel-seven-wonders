import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Booking Confirmation - Travel Seven Wonders",
  description: "Your booking has been confirmed! View your complete itinerary, download your confirmation, and get ready for your journey to the Seven Wonders.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function ConfirmationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

