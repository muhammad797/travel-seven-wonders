"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function EmailVerificationBanner() {
  const { user } = useAuth()
  const router = useRouter()

  // Don't show if user is not logged in or email is verified
  if (!user || user.isEmailVerified) {
    return null
  }

  return (
    <div className="sticky top-16 z-40 w-full border-b bg-yellow-50 dark:bg-yellow-950/50">
      <div className="container mx-auto max-w-6xl px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Please verify your email address
              </p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-0.5">
                Check your inbox for the verification OTP sent to {user.email}
              </p>
            </div>
          </div>
          <Button
            variant="link"
            size="sm"
            className="text-yellow-900 dark:text-yellow-100 hover:text-yellow-950 dark:hover:text-yellow-50 font-medium h-auto py-1 px-2"
            onClick={() => router.push(`/verify-email?email=${encodeURIComponent(user.email)}`)}
          >
            Verify Now
          </Button>
        </div>
      </div>
    </div>
  )
}

