'use client'

import { useState, useCallback } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { useSignMessage } from 'wagmi'

const API_URL = process.env.NEXT_PUBLIC_OWNA_FARM_API || 'https://ownafarm-backend-production.up.railway.app'

interface AdminAuth {
  token: string
  admin: {
    id: string
    wallet_address: string
    role: string
  }
}

export function useAdminAuth() {
  const { wallets } = useWallets()
  const { signMessageAsync } = useSignMessage()
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const authenticate = useCallback(async (): Promise<string | null> => {
    const wallet = wallets[0]
    if (!wallet) {
      setError('No wallet connected')
      return null
    }

    setIsAuthenticating(true)
    setError(null)

    try {
      // Step 1: Get nonce from backend
      const nonceResponse = await fetch(
        `${API_URL}/admin/auth/nonce?wallet_address=${wallet.address}`,
        { method: 'GET' }
      )

      if (!nonceResponse.ok) {
        const err = await nonceResponse.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to get nonce')
      }

      const { nonce, sign_message } = await nonceResponse.json()

      // Step 2: Sign the message using wagmi
      const signature = await signMessageAsync({ message: sign_message })

      // Step 3: Login with signature
      const loginResponse = await fetch(`${API_URL}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: wallet.address,
          signature,
          nonce
        })
      })

      if (!loginResponse.ok) {
        const err = await loginResponse.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to login')
      }

      const authData: AdminAuth = await loginResponse.json()
      setToken(authData.token)
      
      // Store token in sessionStorage for persistence
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin_token', authData.token)
      }
      
      return authData.token
    } catch (err: any) {
      console.error('Admin auth error:', err)
      setError(err.message || 'Authentication failed')
      return null
    } finally {
      setIsAuthenticating(false)
    }
  }, [wallets, signMessageAsync])

  const getToken = useCallback((): string | null => {
    if (token) return token
    
    // Try to get from sessionStorage
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('admin_token')
      if (storedToken) {
        setToken(storedToken)
        return storedToken
      }
    }
    
    return null
  }, [token])

  const logout = useCallback(() => {
    setToken(null)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_token')
    }
  }, [])

  return {
    token,
    getToken,
    authenticate,
    logout,
    isAuthenticating,
    error
  }
}
