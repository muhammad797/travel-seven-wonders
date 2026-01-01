"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/contexts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, CheckCircle2, Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyEmail, resendVerificationEmail } = useAuth()
  
  const [email] = useState(searchParams.get("email") || "")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleOTPChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "")
    if (digit.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOTPPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newOtp = [...otp]
    
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || ""
    }
    
    setOtp(newOtp)
    if (pastedData.length === 6) {
      otpInputRefs.current[5]?.focus()
    } else if (pastedData.length > 0) {
      otpInputRefs.current[pastedData.length]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResendSuccess(false)
    
    const otpString = otp.join("")
    
    if (!email) {
      setError("Email is required. Please access this page from the signup confirmation.")
      return
    }

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP")
      return
    }

    setIsLoading(true)

    try {
      await verifyEmail(email, otpString)
      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err: any) {
      setError(err?.message || "Failed to verify email")
      setOtp(["", "", "", "", "", ""])
      otpInputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError("Email is required. Please access this page from the signup confirmation.")
      return
    }

    setError("")
    setResendSuccess(false)
    setIsResending(true)

    try {
      await resendVerificationEmail(email)
      setResendSuccess(true)
    } catch (err: any) {
      setError(err?.message || "Failed to resend verification email")
    } finally {
      setIsResending(false)
    }
  }

  // Auto-focus first input when page loads
  useEffect(() => {
    setTimeout(() => {
      otpInputRefs.current[0]?.focus()
    }, 100)
  }, [])

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Email Verified</CardTitle>
            <CardDescription className="text-center">
              Your email has been verified successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              You can now access all features. Redirecting to home page...
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <Link href="/" className="text-accent hover:underline font-medium">
              Go to home
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            Enter the OTP sent to your email address to verify your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-center block">Enter 6-digit OTP</Label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    onPaste={handleOTPPaste}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    disabled={isLoading || isResending}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            {resendSuccess && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                Verification email sent successfully! Please check your inbox.
              </p>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isResending || otp.join("").length !== 6}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Email
            </Button>
          </form>
          <div className="space-y-3">
            <Separator />
            <div className="flex flex-col items-center gap-3">
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground"
                onClick={() => router.push("/")}
                disabled={isLoading || isResending}
              >
                Skip for now
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-accent font-medium"
                onClick={handleResend}
                disabled={isLoading || isResending || !email}
              >
                {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Resend Verification Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

