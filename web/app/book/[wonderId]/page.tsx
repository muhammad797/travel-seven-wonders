import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { SEVEN_WONDERS } from "@/lib/mock-data"
import Link from "next/link"
import BookingForm from "@/components/booking-form"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ wonderId: string }> }): Promise<Metadata> {
  const { wonderId } = await params
  const wonder = SEVEN_WONDERS.find((w) => w.id === wonderId)
  
  if (!wonder) {
    return {
      title: "Wonder Not Found - Travel Seven Wonders",
      description: "The requested wonder could not be found.",
    }
  }

  return {
    title: `Book Trip to ${wonder.name} - Travel Seven Wonders`,
    description: `Book your journey to ${wonder.name} in ${wonder.location}, ${wonder.country}. ${wonder.description}`,
    keywords: [wonder.name, wonder.location, wonder.country, "travel booking", "flights", "hotels"],
  }
}

export default async function BookWonderPage({ params }: { params: Promise<{ wonderId: string }> }) {
  const { wonderId } = await params
  const wonder = SEVEN_WONDERS.find((w) => w.id === wonderId)

  if (!wonder) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Wonder not found</h1>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to all wonders
        </Link>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="mb-6 overflow-hidden rounded-xl">
            <img src={wonder.image || "/placeholder.svg"} alt={wonder.name} className="w-full h-[300px] object-cover" />
          </div>
          <div className="text-center">
            <h1 className="mb-3 text-4xl font-bold leading-tight text-balance">
              Journey to <span className="text-accent">{wonder.name}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-2">
              {wonder.location}, {wonder.country}
            </p>
            <p className="mx-auto max-w-2xl text-muted-foreground">{wonder.description}</p>
          </div>
        </div>

        {/* Search Form - Client Component */}
        <BookingForm wonder={wonder} />
      </main>
    </div>
  )
}
