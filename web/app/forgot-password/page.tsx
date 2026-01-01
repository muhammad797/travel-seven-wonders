"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/contexts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { forgotPassword, verifyPasswordResetOTP } = useAuth()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message || "Failed to send password reset OTP")
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    const otpString = otp.join("")
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP")
      return
    }

    setIsVerifyingOTP(true)

    try {
      const isValid = await verifyPasswordResetOTP(email, otpString)
      if (isValid) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otpString}`)
      } else {
        setError("Invalid or expired OTP")
        setOtp(["", "", "", "", "", ""])
        otpInputRefs.current[0]?.focus()
      }
    } catch (err: any) {
      setError(err?.message || "Failed to verify OTP")
      setOtp(["", "", "", "", "", ""])
      otpInputRefs.current[0]?.focus()
    } finally {
      setIsVerifyingOTP(false)
    }
  }

  // Auto-focus first input when success screen appears
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus()
      }, 100)
    }
  }, [success])

  if (success) {
    const otpString = otp.join("")
    const hasCompleteOTP = otpString.length === 6

    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
            <CardDescription className="text-center">
              We've sent a password reset OTP to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Enter the 6-digit OTP sent to your email, or skip for now and enter it later. The OTP will expire in 10 minutes.
            </p>
            
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-center block">Enter OTP (Optional)</Label>
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
                      disabled={isVerifyingOTP}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>
              
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              
              {hasCompleteOTP && (
                <Button type="submit" className="w-full" disabled={isVerifyingOTP}>
                  {isVerifyingOTP && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify OTP & Continue
                </Button>
              )}
            </form>

            <div className="space-y-2">
              <Separator />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
                disabled={isVerifyingOTP}
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="text-accent hover:underline font-medium flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you an OTP to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset OTP
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-accent hover:underline font-medium flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

