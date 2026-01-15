/**
 * API Service Layer for OwnaFarm Frontend
 * Handles all communication with the backend API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ownafarm-backend-production.up.railway.app'

export interface FarmerRegistrationData {
  // Personal Info
  fullName: string
  email: string
  phoneNumber: string
  idNumber: string
  dateOfBirth: string
  address: string
  province: string
  city: string
  district: string
  postalCode: string
  // Business Info
  businessName: string
  businessType: string
  npwp: string
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  yearsOfExperience: string
  cropsExpertise: string[]
  // Documents
  ktpPhoto: File | null
  selfieWithKtp: File | null
  npwpPhoto: File | null
  bankStatement: File | null
  landCertificate: File | null
  businessLicense: File | null
}

export interface FarmerRegistrationResponse {
  success: boolean
  message: string
  data?: {
    farmer_id: string
    status: string
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface PresignedUrl {
  document_type: string
  upload_url: string
  file_key: string
}

interface PresignedUrlResponse {
  status: string
  data: {
    urls: PresignedUrl[]
  }
}

interface DocumentInfo {
  document_type: string
  file_key: string
  file_name: string
  file_size: number
  mime_type: string
}

/**
 * Register a new farmer using presigned URLs (matches backend flow)
 */
export async function registerFarmer(
  data: FarmerRegistrationData
): Promise<FarmerRegistrationResponse> {
  try {
    // Step 1: Prepare documents to upload
    const documentsToUpload: Array<{ type: string, file: File }> = []

    if (data.ktpPhoto) documentsToUpload.push({ type: 'ktp_photo', file: data.ktpPhoto })
    if (data.selfieWithKtp) documentsToUpload.push({ type: 'selfie_with_ktp', file: data.selfieWithKtp })
    if (data.npwpPhoto) documentsToUpload.push({ type: 'npwp_photo', file: data.npwpPhoto })
    if (data.bankStatement) documentsToUpload.push({ type: 'bank_statement', file: data.bankStatement })
    if (data.landCertificate) documentsToUpload.push({ type: 'land_certificate', file: data.landCertificate })
    if (data.businessLicense) documentsToUpload.push({ type: 'business_license', file: data.businessLicense })

    // Step 2: Get presigned URLs from backend
    const documentTypes = documentsToUpload.map(d => d.type)
    const presignedResponse = await fetch(`${API_URL}/farmers/documents/presign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_types: documentTypes
      })
    })

    if (!presignedResponse.ok) {
      throw new ApiError(
        'Failed to get presigned URLs',
        presignedResponse.status
      )
    }

    const presignedData: PresignedUrlResponse = await presignedResponse.json()

    // Step 3: Upload files directly to R2 using presigned URLs with no-cors
    const uploadedDocs: DocumentInfo[] = []

    for (const doc of documentsToUpload) {
      const presignedUrl = presignedData.data.urls.find(
        url => url.document_type === doc.type
      )

      if (!presignedUrl) continue

      // Upload to R2 using presigned URL
      // IMPORTANT: Requires proper CORS configuration on R2 bucket
      try {
        const uploadResponse = await fetch(presignedUrl.upload_url, {
          method: 'PUT',
          body: doc.file
        })

        if (!uploadResponse.ok) {
          console.error(`Failed to upload ${doc.type}:`, uploadResponse.status)
          continue
        }

        // Only add to uploadedDocs if upload succeeded
        uploadedDocs.push({
          document_type: doc.type,
          file_key: presignedUrl.file_key,
          file_name: doc.file.name,
          file_size: doc.file.size,
          mime_type: doc.file.type
        })
      } catch (error) {
        // CORS or network error - file upload failed
        console.error(`CORS/Network error uploading ${doc.type}:`, error)
        // Don't add to uploadedDocs
      }
    }

    // Validate that required documents were uploaded successfully
    const hasKtp = uploadedDocs.some(d => d.document_type === 'ktp_photo')
    const hasSelfie = uploadedDocs.some(d => d.document_type === 'selfie_with_ktp')

    if (!hasKtp || !hasSelfie) {
      throw new ApiError(
        'Required documents failed to upload. This is likely a CORS issue with the storage bucket. Please contact support or try again later.',
        0,
        { uploadedDocs, requiredMissing: !hasKtp ? 'KTP photo' : 'Selfie with KTP' }
      )
    }

    // Step 4: Register farmer with uploaded document keys
    const registerPayload = {
      personal_info: {
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phoneNumber,
        id_number: data.idNumber,
        date_of_birth: data.dateOfBirth,
        address: data.address,
        province: data.province,
        city: data.city,
        district: data.district,
        postal_code: data.postalCode
      },
      business_info: {
        business_name: data.businessName,
        business_type: data.businessType,
        npwp: data.npwp,
        bank_name: data.bankName,
        bank_account_number: data.bankAccountNumber,
        bank_account_name: data.bankAccountName,
        years_of_experience: parseInt(data.yearsOfExperience) || 0,
        crops_expertise: data.cropsExpertise
      },
      documents: uploadedDocs
    }

    const registerResponse = await fetch(`${API_URL}/farmers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerPayload)
    })

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || 'Failed to register farmer',
        registerResponse.status,
        errorData
      )
    }

    const result = await registerResponse.json()

    return {
      success: result.status === 'success',
      message: 'Registration submitted successfully',
      data: result.data
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      undefined,
      error
    )
  }
}

/**
 * Health check endpoint
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: 'GET',
    })
    return response.ok
  } catch (error) {
    return false
  }
}

// ============================================
// Admin API Functions
// ============================================

export interface FarmerDocument {
  id: string
  document_type: string
  file_key: string
  file_name: string
  file_size: number
  mime_type: string
}

export interface Farmer {
  id: string
  full_name: string
  email: string
  phone_number: string
  id_number: string
  date_of_birth: string
  address: string
  province: string
  city: string
  district: string
  postal_code: string
  business_name: string
  business_type: string
  npwp: string
  bank_name: string
  bank_account_number: string
  bank_account_name: string
  years_of_experience: number
  crops_expertise: string[]
  status: 'pending' | 'approved' | 'rejected'
  documents: FarmerDocument[]
  created_at: string
  updated_at: string
  reviewed_at?: string
}

export interface FarmersResponse {
  status: string
  data: {
    farmers: Farmer[]
    total: number
    page: number
    limit: number
  }
}

/**
 * Fetch all farmers (admin endpoint)
 */
export async function getFarmers(status?: string): Promise<Farmer[]> {
  try {
    const url = status && status !== 'all'
      ? `${API_URL}/admin/farmers?status=${status}`
      : `${API_URL}/admin/farmers`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new ApiError('Failed to fetch farmers', response.status)
    }

    const result = await response.json()
    return result.data?.farmers || result.data || []
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to fetch farmers'
    )
  }
}

/**
 * Approve a farmer registration
 */
export async function approveFarmer(farmerId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/admin/farmers/${farmerId}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new ApiError(error.message || 'Failed to approve farmer', response.status)
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to approve farmer'
    )
  }
}

/**
 * Reject a farmer registration
 */
export async function rejectFarmer(farmerId: string, reason?: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/admin/farmers/${farmerId}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason: reason || 'Rejected by admin' })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new ApiError(error.message || 'Failed to reject farmer', response.status)
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to reject farmer'
    )
  }
}
