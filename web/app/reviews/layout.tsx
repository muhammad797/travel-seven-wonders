import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Travel Reviews - Share Your Experience | Travel Seven Wonders",
  description: "Read and share reviews of your journeys to the Seven Wonders of the World. Help other travelers plan their perfect trips with authentic experiences.",
}

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

