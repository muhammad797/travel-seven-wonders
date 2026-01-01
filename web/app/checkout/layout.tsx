import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout - Complete Your Booking | Travel Seven Wonders",
  description: "Complete your booking by entering traveler details and payment information. Secure checkout for your journey to the Seven Wonders of the World.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

