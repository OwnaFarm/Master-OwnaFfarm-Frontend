/**
 * Admin Authentication Service
 * Handles wallet-based authentication for admin endpoints
 * Uses EIP-712 Typed Data Signing for secure authentication
 */

const API_URL = process.env.NEXT_PUBLIC_OWNA_FARM_API || 'https://ownafarm-backend-production.up.railway.app'

// Token storage
let authToken: string | null = null

/**
 * Get stored auth token
 */
export function getAuthToken(): string | null {
  return authToken
}

/**
 * Set auth token
 */
export function setAuthToken(token: string | null): void {
  authToken = token
}

/**
 * Clear auth token (logout)
 */
export function clearAuthToken(): void {
  authToken = null
}

/**
 * Check if admin is authenticated
 */
export function isAdminAuthenticated(): boolean {
  return authToken !== null
}

// API response types based on backend documentation
interface NonceResponse {
  nonce: string
  sign_message: string
}

interface AdminLoginResponse {
  token: string
  admin: {
    id: string
    wallet_address: string
    role: string
  }
}

// EIP-712 Typed Data structure for signing
interface EIP712TypedData {
  types: {
    EIP712Domain: { name: string; type: string }[]
    Login: { name: string; type: string }[]
  }
  primaryType: string
  domain: {
    name: string
    version: string
    chainId: number
  }
  message: {
    message: string
  }
}

/**
 * Build EIP-712 typed data for admin login
 */
export function buildTypedData(signMessage: string): EIP712TypedData {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' }
      ],
      Login: [
        { name: 'message', type: 'string' }
      ]
    },
    primaryType: 'Login',
    domain: {
      name: 'OwnaFarm',
      version: '1',
      chainId: 5003 // Mantle Sepolia chain ID
    },
    message: {
      message: signMessage
    }
  }
}

/**
 * Get nonce and sign message for wallet signature
 */
export async function getAdminNonce(walletAddress: string): Promise<NonceResponse> {
  const response = await fetch(`${API_URL}/admin/auth/nonce?wallet_address=${walletAddress}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || error.error || 'Failed to get nonce')
  }

  const data: NonceResponse = await response.json()
  return data
}

/**
 * Admin login with wallet signature
 */
export async function adminLogin(
  walletAddress: string,
  signature: string,
  nonce: string
): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_URL}/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wallet_address: walletAddress,
      signature: signature,
      nonce: nonce
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || error.error || 'Admin login failed')
  }

  const data: AdminLoginResponse = await response.json()
  
  // Store the token
  authToken = data.token
  
  return data
}

/**
 * Get authorization headers for admin API calls
 */
export function getAuthHeaders(): Record<string, string> {
  if (!authToken) {
    return {
      'Content-Type': 'application/json',
    }
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  }
}

/**
 * Perform authenticated admin login flow using wallet
 * Flow: Get nonce -> Sign EIP-712 typed data -> Login with signature
 */
export async function performAdminLogin(
  walletAddress: string,
  signTypedData: (typedData: EIP712TypedData) => Promise<string>
): Promise<AdminLoginResponse> {
  // Step 1: Get nonce and sign_message from backend
  const nonceData = await getAdminNonce(walletAddress)
  
  // Step 2: Build EIP-712 typed data
  const typedData = buildTypedData(nonceData.sign_message)
  
  // Step 3: Sign the typed data using EIP-712
  const signature = await signTypedData(typedData)
  
  // Step 4: Login with signature
  return await adminLogin(walletAddress, signature, nonceData.nonce)
}
