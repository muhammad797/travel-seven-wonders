import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getBlogPosts, normalizeBlogPost, type BlogPost } from "@/lib/api/blogs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Travel Blog - Expert Guides & Stories from the Seven Wonders",
  description:
    "Read expert travel guides, insider tips, and inspiring stories from the Seven Wonders of the World. Get practical advice for planning your journey to these iconic monuments.",
  keywords: ["travel blog", "Seven Wonders", "travel guides", "travel tips", "travel stories", "destination guides"],
}

export default async function BlogsPage() {
  let posts: BlogPost[] = []
  let error: string | null = null

  try {
    const response = await getBlogPosts({ limit: 20 })
    posts = response.data.map(normalizeBlogPost)
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load blog posts"
    console.error("Error fetching blog posts:", err)
  }

  // If there's an error or no posts, show a fallback UI
  if (error || posts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-6xl px-6 py-12">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-balance">Travel Wonders Blog</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
              Expert guides, insider tips, and inspiring stories from the Seven Wonders of the World
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {error ? "Unable to load blog posts at this time. Please try again later." : "No blog posts available at the moment. Please check back later."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const featuredPost = posts[0]
  const otherPosts = posts.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-balance">Travel Wonders Blog</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Expert guides, insider tips, and inspiring stories from the Seven Wonders of the World
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Link href={`/blogs/${featuredPost.slug}`} className="mb-12 block">
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center p-6">
                  <Badge className="mb-3 w-fit">{featuredPost.category}</Badge>
                  <h2 className="mb-3 text-3xl font-bold text-balance">{featuredPost.title}</h2>
                  <p className="mb-4 text-muted-foreground text-pretty">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Image
                        src={featuredPost.author.avatar || "/placeholder.svg"}
                        alt={featuredPost.author.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span>{featuredPost.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(featuredPost.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )}

        {/* Blog Grid */}
        {otherPosts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map((post) => (
              <Link key={post.id || post.slug} href={`/blogs/${post.slug}`}>
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative h-48">
                    <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <Badge className="mb-2 w-fit">{post.category}</Badge>
                    <h3 className="text-xl font-semibold text-balance">{post.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground text-pretty">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Image
                          src={post.author.avatar || "/placeholder.svg"}
                          alt={post.author.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime} min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
