'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // Require new password to change
    if (!newPassword || newPassword.trim() === '') {
      setError('New password is required to change password')
      return
    }

    // Validation - if new password is provided, it must be at least 8 characters
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }

    // Validate that new password matches confirm password exactly
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please ensure both fields are exactly the same.')
      return
    }

    // Validate current password is provided
    if (!currentPassword || currentPassword.trim() === '') {
      setError('Current password is required to change password')
      return
    }

    setLoading(true)

    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`${API_BASE_URL}/partner/members/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password')
      }

      setMessage('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password (required if changing password)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your current password to verify your identity
              </p>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave empty to keep current password (min 8 characters if provided)"
                    minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password <span className="text-gray-400 text-xs">(required if changing)</span>
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password (must match exactly)"
                    minLength={8}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              className="w-full"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </div>

        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{user.email}</span>
              </div>
              {user.partner && (
                <>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Partner Name:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{user.partner.partnerName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Partner Type:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{user.partner.partnerType}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
