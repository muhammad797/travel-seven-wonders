export default function BlogsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-6 py-12">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <div className="mb-4 h-10 w-64 mx-auto bg-muted animate-pulse rounded" />
          <div className="mx-auto max-w-2xl h-6 bg-muted animate-pulse rounded" />
        </div>

        {/* Featured Post Skeleton */}
        <div className="mb-12">
          <div className="grid gap-6 md:grid-cols-2 bg-muted/50 rounded-lg overflow-hidden animate-pulse">
            <div className="h-64 md:h-96 bg-muted" />
            <div className="p-6 space-y-4">
              <div className="h-6 w-24 bg-muted rounded" />
              <div className="h-8 w-full bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="flex gap-4 mt-4">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-muted/50 rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-20 bg-muted rounded" />
                <div className="h-6 w-full bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

