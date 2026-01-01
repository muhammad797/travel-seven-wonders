"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../types"
import { 
  login as apiLogin, 
  signup as apiSignup, 
  logout as apiLogout, 
  getCurrentUser, 
  getAuthToken,
  forgotPassword as apiForgotPassword,
  verifyPasswordResetOTP as apiVerifyPasswordResetOTP,
  resetPassword as apiResetPassword,
  verifyEmail as apiVerifyEmail,
  resendVerificationEmail as apiResendVerificationEmail,
  updateProfile as apiUpdateProfile,
  type UpdateProfileData,
} from "../api/auth"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithProvider: (provider: "google" | "facebook" | "apple") => Promise<void>
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  verifyPasswordResetOTP: (email: string, otp: string) => Promise<boolean>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>
  verifyEmail: (email: string, otp: string) => Promise<User>
  resendVerificationEmail: (email: string) => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in by verifying token and fetching user profile
    const checkAuth = async () => {
      const token = getAuthToken()
      if (token) {
        try {
          const userData = await getCurrentUser()
          setUser(userData)
        } catch (error) {
          // Token is invalid or expired, remove it
          console.error("Failed to fetch user:", error)
          getAuthToken() && localStorage.removeItem("auth_token")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const result = await apiLogin({ email, password })
    setUser(result.user)
  }

  const loginWithProvider = async (provider: "google" | "facebook" | "apple") => {
    // TODO: Implement OAuth provider login
    // For now, throw an error indicating it's not implemented
    throw new Error(`Login with ${provider} is not yet implemented`)
  }

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    const result = await apiSignup({ email, password, firstName, lastName })
    setUser(result.user)
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      // Even if API call fails, remove token client-side
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

  const forgotPassword = async (email: string) => {
    await apiForgotPassword(email)
  }

  const verifyPasswordResetOTP = async (email: string, otp: string) => {
    return await apiVerifyPasswordResetOTP(email, otp)
  }

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    await apiResetPassword(email, otp, newPassword)
  }

  const verifyEmail = async (email: string, otp: string) => {
    const verifiedUser = await apiVerifyEmail(email, otp)
    // Update user state if current user's email was verified
    if (user && user.email === verifiedUser.email) {
      setUser(verifiedUser)
    }
    return verifiedUser
  }

  const resendVerificationEmail = async (email: string) => {
    await apiResendVerificationEmail(email)
  }

  const updateProfile = async (data: UpdateProfileData) => {
    const updatedUser = await apiUpdateProfile(data)
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithProvider, 
      signup, 
      logout, 
      forgotPassword,
      verifyPasswordResetOTP,
      resetPassword,
      verifyEmail,
      resendVerificationEmail,
      updateProfile,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

