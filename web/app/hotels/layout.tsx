import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Select Hotels - Travel Seven Wonders",
  description: "Choose from carefully selected hotels near your chosen wonder. Add multiple stays to build your complete itinerary with our expert-curated accommodations.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function HotelsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

