'use client'

import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getApiBaseUrlWithV1 } from '@/lib/env'

function SetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [inviteInvalid, setInviteInvalid] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [inviteEmail, setInviteEmail] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const verify = async () => {
      if (!token) {
        setVerifying(false)
        setInviteInvalid(true)
        setError('Invitation link is missing or invalid.')
        return
      }

      try {
        const response = await fetch(
          `${getApiBaseUrlWithV1()}/partner-auth/invitations/verify`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invitationToken: token }),
          },
        )
        const data = await response.json()

        if (!response.ok || data.valid === false) {
          throw new Error(
            data.reason === 'EXPIRED'
              ? 'This invitation has expired. Ask your admin to resend it.'
              : data.reason === 'ALREADY_USED'
                ? 'This invitation has already been used.'
                : data.message || 'Invalid invitation link.',
          )
        }

        if (!cancelled) {
          setInviteEmail(data.email || null)
        }
      } catch (err: any) {
        if (!cancelled) {
          setInviteInvalid(true)
          setError(err.message || 'Could not verify invitation')
        }
      } finally {
        if (!cancelled) {
          setVerifying(false)
        }
      }
    }

    verify()
    return () => {
      cancelled = true
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!token) {
      setError('Invitation link is missing or invalid.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `${getApiBaseUrlWithV1()}/partner-auth/invitations/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invitationToken: token,
            password: newPassword,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Failed to set password')
      }

      setMessage('Password set successfully. You can now log in.')
      setTimeout(() => {
        router.push('/auth/login')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to set password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex flex-row gap-[20px]">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-white shadow-md">
            <Image
              src="/images/logo.jpg"
              alt="RukaPay"
              width={56}
              height={56}
              className="rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Set Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Activate your partner dashboard account
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {verifying ? (
          <div className="text-center text-gray-500">Verifying invitation…</div>
        ) : inviteInvalid ? (
          <Link
            href="/auth/login"
            className="block text-center text-sm font-medium text-[#08163d] hover:underline"
          >
            Back to login
          </Link>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {inviteEmail && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Setting password for <span className="font-medium">{inviteEmail}</span>
              </p>
            )}

            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New password
              </label>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm password
              </label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full"
            >
              {loading ? 'Saving…' : 'Set password & activate'}
            </Button>

            <Link
              href="/auth/login"
              className="block text-center text-sm font-medium text-[#08163d] hover:underline"
            >
              Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="text-gray-500">Loading…</div>
        </div>
      }
    >
      <SetPasswordForm />
    </Suspense>
  )
}
