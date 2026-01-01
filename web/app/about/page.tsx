import { Card, CardContent } from "@/components/ui/card"
import { Users, Globe, Award, Heart } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Travel Seven Wonders",
  description:
    "Learn about Travel Seven Wonders - our mission to make dream journeys to the world's most extraordinary monuments accessible to everyone. Discover our story, values, and leadership team.",
  keywords: ["about", "travel company", "Seven Wonders", "travel mission", "our story"],
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-6 py-12">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">About Travel Wonders</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance">
            We're passionate about making dream journeys to the world's most extraordinary monuments accessible to
            everyone.
          </p>
        </div>

        {/* Story */}
        <div className="mb-16">
          <h2 className="mb-6 text-3xl font-bold">Our Story</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Travel Wonders was founded in 2020 with a simple mission: to inspire and enable travelers to experience
              the Seven Wonders of the World. What started as a passion project by a group of travel enthusiasts has
              grown into a comprehensive platform serving thousands of adventurers worldwide.
            </p>
            <p>
              We believe that visiting these iconic monuments isn't just about checking boxes on a bucket list—it's
              about connecting with human history, understanding different cultures, and creating memories that last a
              lifetime. Our team has personally visited each wonder multiple times, allowing us to provide authentic
              insights and curated experiences.
            </p>
            <p>
              Today, we partner with trusted airlines, carefully selected hotels, and local guides to ensure every
              aspect of your journey is seamless. From the moment you choose your destination to the memories you bring
              home, we're with you every step of the way.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-center">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Globe className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">Authentic Experiences</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize genuine cultural immersion over tourist traps
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">Customer First</h3>
                <p className="text-sm text-muted-foreground">Your satisfaction and safety are our top priorities</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  We partner only with the highest-rated service providers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-lg">Sustainability</h3>
                <p className="text-sm text-muted-foreground">We're committed to responsible and sustainable tourism</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="mb-8 text-3xl font-bold text-center">Leadership Team</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 mx-auto h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Sarah Chen</h3>
                <p className="text-sm text-accent mb-2">Founder & CEO</p>
                <p className="text-sm text-muted-foreground">
                  Former travel journalist with 15 years exploring world heritage sites
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 mx-auto h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Marco Rossi</h3>
                <p className="text-sm text-accent mb-2">Head of Operations</p>
                <p className="text-sm text-muted-foreground">
                  20 years in hospitality management across three continents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 mx-auto h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Priya Sharma</h3>
                <p className="text-sm text-accent mb-2">Customer Experience Director</p>
                <p className="text-sm text-muted-foreground">
                  Dedicated to ensuring every journey exceeds expectations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
