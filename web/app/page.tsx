import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Sparkles, ArrowRight } from "lucide-react"
import { SEVEN_WONDERS } from "@/lib/mock-data"
import Link from "next/link"
import { getBlogPosts, normalizeBlogPost } from "@/lib/api/blogs"
import { BlogPostCard } from "@/components/blog-post-card"
import { WonderCard } from "@/components/wonder-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Travel Seven Wonders - Book Your Dream Journey to the World's Greatest Monuments",
  description:
    "Experience the Seven Wonders of the World with seamless travel planning. Book flights and hotels to visit the Colosseum, Great Wall of China, Taj Mahal, Machu Picchu, Petra, Chichen Itza, and Christ the Redeemer.",
  keywords: ["Seven Wonders", "travel", "bookings", "flights", "hotels", "Colosseum", "Great Wall", "Taj Mahal", "Machu Picchu", "Petra", "Chichen Itza", "Christ the Redeemer"],
}

async function getFeaturedBlogs() {
  try {
    const response = await getBlogPosts({ limit: 3 })
    return response.data.map(normalizeBlogPost)
  } catch (error) {
    console.error("Error fetching featured blogs:", error)
    return []
  }
}

export default async function HomePage() {
  const featuredBlogs = await getFeaturedBlogs()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <main className="container mx-auto max-w-6xl px-6 py-12">
        <div className="mb-16 text-center">
          <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20" variant="secondary">
            <Sparkles className="mr-1 h-3 w-3" />
            Explore the World's Greatest Monuments
          </Badge>
          <h1 className="mb-4 text-5xl font-bold leading-tight text-balance lg:text-6xl">
            Journey to the <span className="text-accent">Seven Wonders</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance">
            Experience the most extraordinary monuments humanity has ever created. Choose your destination and let us
            craft your perfect journey.
          </p>
        </div>

        {/* Seven Wonders Grid */}
        <div className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-center">Select Your Wonder</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SEVEN_WONDERS.map((wonder) => (
              <WonderCard key={wonder.id} wonder={wonder} />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Expert Curated</h3>
              <p className="text-sm text-muted-foreground">
                Carefully selected hotels near each wonder for the best experience
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Seamless Booking</h3>
              <p className="text-sm text-muted-foreground">
                Book flights and hotels together for a hassle-free journey
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Our travel experts are always ready to help plan your adventure
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Travel Stories & Guides</h2>
              <p className="text-muted-foreground">Insights and tips from experienced travelers</p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/blogs">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredBlogs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {featuredBlogs.map((post) => (
                <BlogPostCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Travel guides coming soon. Check back later for inspiring stories and expert tips!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
