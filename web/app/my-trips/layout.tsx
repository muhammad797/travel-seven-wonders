import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Trips - Manage Your Bookings | Travel Seven Wonders",
  description: "View and manage all your bookings to the Seven Wonders. Request changes, cancellations, or contact support for your upcoming journeys.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function MyTripsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

