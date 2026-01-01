import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rewards Program - Earn Points & Benefits | Travel Seven Wonders",
  description: "Join the Travel Seven Wonders rewards program. Earn points with every booking and unlock exclusive benefits, discounts, and special offers.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

