export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        {/* Back Button Skeleton */}
        <div className="mb-6 h-10 w-32 bg-muted animate-pulse rounded" />

        {/* Header Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
          <div className="h-12 w-full bg-muted animate-pulse rounded" />
          <div className="flex gap-4">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="mb-8 h-96 bg-muted animate-pulse rounded-lg" />

        {/* Content Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

