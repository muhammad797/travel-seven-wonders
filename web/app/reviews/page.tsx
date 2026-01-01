"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, MapPin, Calendar, Edit3, Trash2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Review {
  id: string
  bookingNumber: string
  destination: string
  rating: number
  title: string
  comment: string
  date: string
  helpful: number
}

export default function ReviewsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      bookingNumber: "TSW-001234",
      destination: "Colosseum, Rome",
      rating: 5,
      title: "Amazing experience at the Colosseum!",
      comment:
        "The trip was absolutely incredible. The hotel was perfectly located near the Colosseum, and the entire experience exceeded our expectations. Would definitely book again!",
      date: "2024-11-28",
      helpful: 12,
    },
    {
      id: "2",
      bookingNumber: "TSW-001156",
      destination: "Machu Picchu, Peru",
      rating: 4,
      title: "Breathtaking views and smooth journey",
      comment:
        "Machu Picchu was a dream come true. The flight connections were smooth and the hotel provided great service. Only minor issue was the weather, but that's unpredictable!",
      date: "2024-10-15",
      helpful: 8,
    },
  ])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-5 w-5 ${i < rating ? "fill-accent text-accent" : "text-muted"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
            <p className="text-muted-foreground">Share your travel experiences with the community</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} className="hover:scale-110 transition-transform">
                        <Star className="h-8 w-8 text-muted hover:text-accent hover:fill-accent" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-title">Title</Label>
                  <input
                    id="review-title"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Summarize your experience..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-comment">Your Review</Label>
                  <Textarea
                    id="review-comment"
                    placeholder="Share details about your trip..."
                    rows={6}
                    className="resize-none"
                  />
                </div>
                <Button className="w-full">Submit Review</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-accent">{reviews.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Reviews</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-accent">{averageRating.toFixed(1)}</p>
                <div className="flex justify-center gap-1 mt-2">{renderStars(Math.round(averageRating))}</div>
                <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-accent">{reviews.reduce((sum, r) => sum + r.helpful, 0)}</p>
                <p className="text-sm text-muted-foreground mt-1">Helpful Votes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{review.destination}</span>
                      <Badge variant="outline" className="text-xs">
                        {review.bookingNumber}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{review.title}</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1">{renderStars(review.rating)}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(review.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">{review.comment}</p>
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    👍 Helpful ({review.helpful})
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {review.helpful} {review.helpful === 1 ? "person" : "people"} found this helpful
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reviews.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-6">Share your travel experiences with other travelers</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Write Your First Review</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button key={i} className="hover:scale-110 transition-transform">
                            <Star className="h-8 w-8 text-muted hover:text-accent hover:fill-accent" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="review-title">Title</Label>
                      <input
                        id="review-title"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Summarize your experience..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="review-comment">Your Review</Label>
                      <Textarea
                        id="review-comment"
                        placeholder="Share details about your trip..."
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                    <Button className="w-full">Submit Review</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
