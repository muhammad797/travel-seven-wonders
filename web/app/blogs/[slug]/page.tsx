import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, Share2, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getBlogPostBySlug, getBlogPosts, normalizeBlogPost, type BlogPost } from "@/lib/api/blogs"
import type { Metadata } from "next"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const fetchedPost = await getBlogPostBySlug(slug)
    if (!fetchedPost) {
      return {
        title: "Blog Post Not Found - Travel Seven Wonders",
        description: "The requested blog post could not be found.",
      }
    }
    const post = normalizeBlogPost(fetchedPost)
    return {
      title: `${post.title} - Travel Seven Wonders Blog`,
      description: post.excerpt,
      keywords: [post.category, ...(post.tags || [])],
    }
  } catch {
    return {
      title: "Blog Post - Travel Seven Wonders",
      description: "Read travel guides and stories from the Seven Wonders of the World.",
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  
  let post: BlogPost | null = null
  let relatedPosts: BlogPost[] = []

  try {
    // Fetch the blog post
    const fetchedPost = await getBlogPostBySlug(slug)
    
    if (!fetchedPost) {
      notFound()
    }

    post = normalizeBlogPost(fetchedPost)

    // Fetch related posts (exclude current post, prefer same category)
    const allPostsResponse = await getBlogPosts({ limit: 12 })
    const allPosts = allPostsResponse.data.map(normalizeBlogPost)
    
    // Try to get posts from the same category first, then others
    const sameCategoryPosts = allPosts
      .filter((p) => p.slug !== slug && p.category === post!.category)
      .slice(0, 2)
    
    if (sameCategoryPosts.length >= 2) {
      relatedPosts = sameCategoryPosts
    } else {
      // Mix same category and other posts
      const otherPosts = allPosts
        .filter((p) => p.slug !== slug && p.category !== post!.category)
        .slice(0, 2 - sameCategoryPosts.length)
      relatedPosts = [...sameCategoryPosts, ...otherPosts]
    }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        {/* Back Button */}
        <Link href="/blogs">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </Link>

        {/* Header */}
        <article>
          <div className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl text-balance">{post.title}</h1>

            {/* Meta Information */}
            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Image
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Tags and Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-y py-4">
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative mb-8 h-96 overflow-hidden rounded-lg">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 border-t pt-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">More Travel Guides</h2>
                <p className="text-muted-foreground">Continue exploring with these related guides</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id || relatedPost.slug} className="group">
                    <Link href={`/blogs/${relatedPost.slug}`}>
                      <div className="overflow-hidden rounded-lg border transition-all hover:shadow-lg hover:border-accent/50">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={relatedPost.image || "/placeholder.svg"}
                            alt={relatedPost.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-5">
                          <Badge className="mb-3" variant="outline">
                            {relatedPost.category}
                          </Badge>
                          <h3 className="font-semibold text-lg mb-2 text-balance group-hover:text-accent transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(relatedPost.publishedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{relatedPost.readTime} min read</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/blogs">
                  <Button variant="outline">
                    View All Travel Guides
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
