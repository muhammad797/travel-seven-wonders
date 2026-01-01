"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Wonder } from "@/lib/types"

interface WonderCardProps {
  wonder: Wonder
}

export function WonderCard({ wonder }: WonderCardProps) {
  const router = useRouter()

  const handleWonderSelect = (wonderId: string) => {
    router.push(`/book/${wonderId}`)
  }

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]"
      onClick={() => handleWonderSelect(wonder.id)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={wonder.image || "/placeholder.svg"}
          alt={wonder.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white mb-1">{wonder.name}</h3>
          <div className="flex items-center gap-1 text-white/90 text-sm">
            <MapPin className="h-3 w-3" />
            <span>
              {wonder.location}, {wonder.country}
            </span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{wonder.description}</p>
      </CardContent>
    </Card>
  )
}

