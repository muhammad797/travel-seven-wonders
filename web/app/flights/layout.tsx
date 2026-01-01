import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search Flights - Travel Seven Wonders",
  description: "Search and compare flights to your chosen wonder. Filter by price, duration, stops, and departure time. Find the perfect flight for your journey.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function FlightsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

