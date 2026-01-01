import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Account - Travel Seven Wonders",
  description: "Create your Travel Seven Wonders account to start booking trips to the Seven Wonders of the World. Join thousands of travelers on their dream journeys.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

