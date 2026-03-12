'use client'

import { getAccessToken, logout } from './auth'
import { getApiBaseUrlWithV1 } from './env'

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAccessToken()
  const API_BASE_URL = getApiBaseUrlWithV1()

  // Convert options.headers to a plain object if it's a Headers instance
  const existingHeaders: Record<string, string> = options.headers instanceof Headers
    ? Object.fromEntries(options.headers.entries())
    : ((options.headers as Record<string, string>) || {})
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...existingHeaders,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // On 401 Unauthorized - logout and redirect to login
  if (response.status === 401) {
    const returnUrl = typeof window !== 'undefined' ? window.location.pathname : undefined
    logout(returnUrl)
    throw new Error('Session expired. Please log in again.')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function getPartnerProfile() {
  return apiRequest('/partner-auth/profile', {
    method: 'GET',
  })
}

export async function getPartnerTransactions(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  type?: string;
  direction?: string;
  channel?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  fromDate?: string; // ISO date (YYYY-MM-DD)
  toDate?: string;   // ISO date (YYYY-MM-DD)
}) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.pageSize) query.set('pageSize', String(params.pageSize))
  if (params?.status) query.set('status', params.status)
  if (params?.type) query.set('type', params.type)
  if (params?.direction) query.set('direction', params.direction)
  if (params?.channel) query.set('channel', params.channel)
  if (params?.search) query.set('search', params.search)
  if (params?.minAmount !== undefined) query.set('minAmount', String(params.minAmount))
  if (params?.maxAmount !== undefined) query.set('maxAmount', String(params.maxAmount))
  if (params?.fromDate) query.set('fromDate', params.fromDate)
  if (params?.toDate) query.set('toDate', params.toDate)

  const qs = query.toString()
  const endpoint = qs ? `/partner-auth/transactions?${qs}` : '/partner-auth/transactions'

  return apiRequest(endpoint, {
    method: 'GET',
  })
}

export async function getPartnerTransactionVolume(days: number = 7) {
  return apiRequest(`/partner-auth/transaction-volume?days=${days}`, {
    method: 'GET',
  })
}

export async function getCustomerCount(startDate: string, endDate: string) {
  const query = new URLSearchParams()
  query.set('startDate', startDate)
  query.set('endDate', endDate)
  return apiRequest(`/partner-auth/customer-count?${query.toString()}`, {
    method: 'GET',
  })
}

export async function getTransactionVolume(params: {
  startDate: string
  endDate: string
  status?: string
  currency?: string
}) {
  const query = new URLSearchParams()
  query.set('startDate', params.startDate)
  query.set('endDate', params.endDate)
  if (params.status) query.set('status', params.status)
  if (params.currency) query.set('currency', params.currency)
  return apiRequest(`/partner-auth/transaction-volume?${query.toString()}`, {
    method: 'GET',
  })
}

export async function getTransactionsByGender(params: {
  startDate: string
  endDate: string
  status?: string
  currency?: string
}) {
  const query = new URLSearchParams()
  query.set('startDate', params.startDate)
  query.set('endDate', params.endDate)
  if (params.status) query.set('status', params.status)
  if (params.currency) query.set('currency', params.currency)
  return apiRequest(`/partner-auth/transactions-by-gender?${query.toString()}`, {
    method: 'GET',
  })
}

export async function getTransactionsByAmountBands(params: {
  startDate: string
  endDate: string
  status?: string
  currency?: string
  amountBands?: Array<{ minAmount: number; maxAmount: number }>
}) {
  const query = new URLSearchParams()
  query.set('startDate', params.startDate)
  query.set('endDate', params.endDate)
  if (params.status) query.set('status', params.status)
  if (params.currency) query.set('currency', params.currency)
  if (params.amountBands) {
    query.set('amountBands', JSON.stringify(params.amountBands))
  }
  return apiRequest(`/partner-auth/transactions-by-amount-bands?${query.toString()}`, {
    method: 'GET',
  })
}

export async function generateGatewayApiKey(partnerId: string, environment: 'DEVELOPMENT' | 'PRODUCTION') {
  // Backend controller path: /api/v1/admin/gateway-partners/api-keys
  return apiRequest('/api/v1/admin/gateway-partners/api-keys', {
    method: 'POST',
    body: JSON.stringify({ partnerId, environment }),
  })
}

export async function revokeGatewayApiKey(keyId: string, reason: string) {
  // Backend controller path: /api/v1/admin/gateway-partners/api-keys/:keyId/revoke
  return apiRequest(`/api/v1/admin/gateway-partners/api-keys/${keyId}/revoke`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

// ─── Partner Reversal Requests (Gateway) ───────────────────────────────────────

export type PartnerReversalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'

export async function submitPartnerReversalRequest(input: {
  transactionId: string
  reason: string
  details?: string
}) {
  // Backend: POST /api/v1/gateway/reversal-requests (SubmitReversalRequestDto)
  return apiRequest('/api/v1/gateway/reversal-requests', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function listPartnerReversalRequests(params?: {
  page?: number
  limit?: number
  status?: PartnerReversalStatus
}) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))
  if (params?.status) query.set('status', params.status)

  const qs = query.toString()
  const endpoint = qs
    ? `/api/v1/gateway/reversal-requests?${qs}`
    : '/api/v1/gateway/reversal-requests'

  return apiRequest(endpoint, {
    method: 'GET',
  })
}

export async function cancelPartnerReversalRequest(requestId: string) {
  // Backend: PATCH /api/v1/gateway/reversal-requests/:requestId/cancel
  return apiRequest(`/api/v1/gateway/reversal-requests/${requestId}/cancel`, {
    method: 'PATCH',
  })
}
