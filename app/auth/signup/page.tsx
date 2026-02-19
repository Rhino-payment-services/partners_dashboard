'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, AlertCircle, Loader2, Lock } from 'lucide-react'
import { isSignupAllowed, getApiBaseUrlWithV1 } from '@/lib/env'

interface FormData {
  partnerName: string
  contactEmail: string
  contactPhone: string
  country: string
  contactPerson: string
  tier: 'SILVER' | 'GOLD' | 'PLATINUM'
  website: string
  address: string
  description: string
  walletTypes: Array<'ESCROW' | 'COMMISSION'>
}

export default function Signup() {
  const router = useRouter()
  const [signupAllowed, setSignupAllowed] = useState<boolean | null>(null)

  const [formData, setFormData] = useState<FormData>({
    partnerName: '',
    contactEmail: '',
    contactPhone: '',
    country: '',
    contactPerson: '',
    tier: 'GOLD',
    website: '',
    address: '',
    description: '',
    walletTypes: ['ESCROW'], // Always ESCROW only
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)

  // Check if signup is allowed on mount
  useEffect(() => {
    const allowed = isSignupAllowed()
    setSignupAllowed(allowed)
    
    if (!allowed) {
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }, [router])

  // Show loading state while checking
  if (signupAllowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#08163d]" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show access denied page if signup is not allowed
  if (!signupAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Registration Not Available
          </h2>
          <p className="text-gray-600 mb-6">
            Partner registration is currently only available in development and staging environments.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please contact our team to request partner access for production.
          </p>
          <div className="flex gap-4">
            <Link href="/" className="flex-1">
              <Button className="w-full" variant="outline">
                Go to Home
              </Button>
            </Link>
            <Link href="/auth/login" className="flex-1">
              <Button className="w-full">
                Login
              </Button>
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Redirecting to home page in 3 seconds...
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validate required fields
    if (!formData.partnerName || !formData.contactEmail || !formData.contactPhone || !formData.country) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      // Prepare request data (only send fields that have values)
      // walletTypes is always ['ESCROW'] for public signup
      const requestData: any = {
        partnerName: formData.partnerName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        country: formData.country.toUpperCase(),
        tier: formData.tier,
        walletTypes: ['ESCROW'], // Always ESCROW only
      }

      // Add optional fields if they have values
      if (formData.contactPerson) requestData.contactPerson = formData.contactPerson
      if (formData.website) requestData.website = formData.website
      if (formData.address) requestData.address = formData.address
      if (formData.description) requestData.description = formData.description

      const response = await fetch(`${getApiBaseUrlWithV1()}/gateway/partners/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create partner account')
      }

      setSuccess(true)
      setSubmittedData(data)
    } catch (err: any) {
      setError(err.message || 'Failed to create partner account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Account Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your partner account has been created. Our team will review your application and contact you shortly.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Our team will review your application within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>You'll receive an email with your API credentials once approved</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Access our sandbox environment to start testing integrations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Check out our documentation to learn about our APIs</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Link href="/dashboard/documentation" className="flex-1">
              <Button className="w-full" variant="outline">
                View Documentation
              </Button>
            </Link>
            <Link href="/auth/login" className="flex-1">
              <Button className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <Image src="/images/logo.jpg" alt="RukaPay" width={32} height={32} className="rounded-lg object-cover" />
              </div>
              <span className="text-xl font-bold text-[#08163d]">RukaPay</span>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Sandbox</h1>
          <p className="text-xl text-gray-600">
            Create your partner account to start integrating with RukaPay Payment Gateway
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-4">
          {/* Partner Information Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Partner Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Partner Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="partnerName"
                  value={formData.partnerName}
                  onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                  placeholder="e.g., Acme Payment Solutions"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="integrations@partner.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+256700123456"
                  required
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                  placeholder="e.g., UGANDA"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Integration Team Lead"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://partner.com"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your business and how you plan to use RukaPay..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#08163d] focus:border-transparent"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">What happens after signup?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your application will be reviewed by our team</li>
                  <li>• You'll receive API credentials via email once approved</li>
                  <li>• Access to sandbox environment for testing</li>
                  <li>• Full documentation and integration support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="bg-[#08163d] hover:bg-[#08163d]/90">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
