"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Coins, Gift, Trophy, Plane, Hotel, Star, TrendingUp, Clock } from "lucide-react"

export default function RewardsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

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

  const pointsToNextTier = 2500 - (user.rewardPoints % 2500)
  const tierProgress = ((user.rewardPoints % 2500) / 2500) * 100

  const rewardHistory = [
    {
      id: "1",
      type: "earned",
      description: "Flight booking to Rome",
      points: 450,
      date: "2024-12-15",
    },
    {
      id: "2",
      type: "earned",
      description: "Hotel booking - 3 nights",
      points: 300,
      date: "2024-12-15",
    },
    {
      id: "3",
      type: "earned",
      description: "Sign-up bonus",
      points: 500,
      date: "2024-01-15",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Rewards & Wallet</h1>
          <p className="text-muted-foreground">Track your points and redeem exclusive rewards</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Points Balance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-6 w-6 text-accent" />
                    Your Points Balance
                  </CardTitle>
                  <CardDescription>Earn points on every booking and redeem for rewards</CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Trophy className="h-4 w-4 mr-2" />
                  Silver Tier
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-6">
                <p className="text-5xl font-bold text-accent">{user.rewardPoints.toLocaleString()}</p>
                <p className="text-muted-foreground mt-2">Total Points</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress to Gold Tier</span>
                  <span className="font-medium">{pointsToNextTier} points to go</span>
                </div>
                <Progress value={tierProgress} className="h-2" />
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-2">
                    <Plane className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Flights Booked</p>
                </div>
                <div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-2">
                    <Hotel className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Hotel Stays</p>
                </div>
                <div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-2xl font-bold">12%</p>
                  <p className="text-xs text-muted-foreground">Savings Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Redeem Points
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Gift className="h-4 w-4 mr-2" />
                View Rewards Catalog
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Trophy className="h-4 w-4 mr-2" />
                Tier Benefits
              </Button>
            </CardContent>
          </Card>

          {/* Points History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Points History
              </CardTitle>
              <CardDescription>Your recent point earning activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewardHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          item.type === "earned" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                        }`}
                      >
                        {item.type === "earned" ? (
                          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Gift className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <p className={`font-semibold ${item.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                      {item.type === "earned" ? "+" : "-"}
                      {item.points}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Membership Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Silver Benefits</CardTitle>
              <CardDescription>Your current tier perks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Star className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Priority Boarding</p>
                  <p className="text-xs text-muted-foreground">Board flights before general passengers</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Star className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Free Upgrades</p>
                  <p className="text-xs text-muted-foreground">Subject to availability on select hotels</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Star className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Bonus Points</p>
                  <p className="text-xs text-muted-foreground">Earn 10% more on every booking</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Star className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">24/7 Support</p>
                  <p className="text-xs text-muted-foreground">Dedicated support line</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
