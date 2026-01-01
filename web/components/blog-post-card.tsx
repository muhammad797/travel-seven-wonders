import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { BlogPost } from "@/lib/api/blogs"

interface BlogPostCardProps {
  post: BlogPost
  variant?: "default" | "compact" | "featured"
  showExcerpt?: boolean
}

export function BlogPostCard({ post, variant = "default", showExcerpt = true }: BlogPostCardProps) {
  const isCompact = variant === "compact"
  const isFeatured = variant === "featured"

  if (isFeatured) {
    return (
      <Link href={`/blogs/${post.slug}`}>
        <Card className="group overflow-hidden transition-all hover:shadow-xl">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <Badge className="absolute top-4 left-4 bg-accent text-white border-0">
              {post.category}
            </Badge>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              {showExcerpt && (
                <p className="text-sm text-white/90 line-clamp-2 mb-3">{post.excerpt}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-white/80">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  if (isCompact) {
    return (
      <Link href={`/blogs/${post.slug}`}>
        <div className="group overflow-hidden rounded-lg border transition-all hover:shadow-lg hover:border-accent/50">
          <div className="relative h-40 overflow-hidden">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="p-4">
            <Badge className="mb-2" variant="outline">
              {post.category}
            </Badge>
            <h3 className="font-semibold text-balance mb-2 group-hover:text-accent transition-colors line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blogs/${post.slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <Badge className="absolute top-3 left-3 bg-accent text-white border-0">
            {post.category}
          </Badge>
        </div>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          {showExcerpt && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

