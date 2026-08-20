'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, UserPlus, Trash2, X, AlertCircle, Pencil, KeyRound, Mail } from 'lucide-react'
import { apiRequest, getPartnerProfile } from '@/lib/api'
import { usePartnerPermissions } from '@/hooks/use-partner-permissions'

interface PartnerMember {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  status: string
  canViewTransactions: boolean
  canManageApiKeys: boolean
  canViewAnalytics: boolean
  canManageMembers: boolean
  canConfigureTariffs: boolean
  invitedAt: string
  acceptedAt: string | null
  createdAt: string
}

export default function MembersPage() {
  const { canManageMembers, loading: permissionsLoading } = usePartnerPermissions()
  const [members, setMembers] = useState<PartnerMember[]>([])
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false)
  const [adding, setAdding] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [settingPassword, setSettingPassword] = useState(false)
  const [sendingReset, setSendingReset] = useState<string | null>(null)
  const [editingMember, setEditingMember] = useState<PartnerMember | null>(null)
  const [passwordTargetMember, setPasswordTargetMember] = useState<PartnerMember | null>(null)
  const [setPasswordForm, setSetPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  // Add member form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'MEMBER' as 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'MEMBER' | 'VIEWER',
  })
  const [editFormData, setEditFormData] = useState({
    role: 'MEMBER' as 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'MEMBER' | 'VIEWER',
    canViewTransactions: true,
    canManageApiKeys: false,
    canViewAnalytics: true,
    canManageMembers: false,
    canConfigureTariffs: false,
  })

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    if (partnerId) {
      loadMembers()
    }
  }, [partnerId])

  const loadProfile = async () => {
    try {
      const profile = await getPartnerProfile()
      setPartnerId(profile.partner?.id || null)
    } catch (err: any) {
      console.error('Failed to load profile', err)
    }
  }

  const loadMembers = async () => {
    if (!partnerId) return

    try {
      setLoading(true)
      setError('')
      const response = await apiRequest(`/partner/${partnerId}/members`, {
        method: 'GET',
      })
      setMembers(response.members || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!partnerId) {
      setError('Partner not found')
      return
    }

    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    try {
      setAdding(true)
      await apiRequest(`/partner/${partnerId}/members/add-direct`, {
        method: 'POST',
        body: JSON.stringify({
          partnerId,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber || undefined,
          role: formData.role,
        }),
      })

      setSuccess('Member added successfully!')
      setShowAddModal(false)
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: 'MEMBER',
      })
      await loadMembers()
    } catch (err: any) {
      setError(err.message || 'Failed to add member')
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) {
      return
    }

    try {
      setDeleting(memberId)
      setError('')
      await apiRequest(`/partner/members/${memberId}`, {
        method: 'DELETE',
      })
      setSuccess('Member removed successfully!')
      await loadMembers()
    } catch (err: any) {
      setError(err.message || 'Failed to remove member')
    } finally {
      setDeleting(null)
    }
  }

  const handleOpenEditModal = (member: PartnerMember) => {
    setEditingMember(member)
    setEditFormData({
      role: member.role as 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'MEMBER' | 'VIEWER',
      canViewTransactions: member.canViewTransactions,
      canManageApiKeys: member.canManageApiKeys,
      canViewAnalytics: member.canViewAnalytics,
      canManageMembers: member.canManageMembers,
      canConfigureTariffs: member.canConfigureTariffs,
    })
    setError('')
    setSuccess('')
    setShowEditModal(true)
  }

  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!editingMember) {
      setError('No member selected for editing')
      return
    }

    try {
      setUpdating(true)
      await apiRequest(`/partner/members/${editingMember.id}`, {
        method: 'PATCH',
        body: JSON.stringify(editFormData),
      })
      setSuccess('Member updated successfully!')
      setShowEditModal(false)
      setEditingMember(null)
      await loadMembers()
    } catch (err: any) {
      setError(err.message || 'Failed to update member')
    } finally {
      setUpdating(false)
    }
  }

  const handleOpenSetPasswordModal = (member: PartnerMember) => {
    setPasswordTargetMember(member)
    setSetPasswordForm({ newPassword: '', confirmPassword: '' })
    setError('')
    setSuccess('')
    setShowSetPasswordModal(true)
  }

  const handleSetMemberPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!partnerId || !passwordTargetMember) {
      setError('No member selected')
      return
    }

    if (setPasswordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (setPasswordForm.newPassword !== setPasswordForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setSettingPassword(true)
      const response = await apiRequest(
        `/partner/${partnerId}/members/${passwordTargetMember.id}/set-password`,
        {
          method: 'POST',
          body: JSON.stringify({
            newPassword: setPasswordForm.newPassword,
            confirmPassword: setPasswordForm.confirmPassword,
          }),
        },
      )
      setSuccess(response.message || `Password updated for ${passwordTargetMember.email}`)
      setShowSetPasswordModal(false)
      setPasswordTargetMember(null)
      setSetPasswordForm({ newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      setError(err.message || 'Failed to set password')
    } finally {
      setSettingPassword(false)
    }
  }

  const handleSendPasswordReset = async (member: PartnerMember) => {
    if (!partnerId) {
      setError('Partner not found')
      return
    }

    if (
      !confirm(
        `Send a password reset email to ${member.email}? They will receive a link to set a new password.`,
      )
    ) {
      return
    }

    try {
      setSendingReset(member.id)
      setError('')
      const response = await apiRequest(
        `/partner/${partnerId}/members/${member.id}/send-password-reset`,
        { method: 'POST' },
      )
      setSuccess(response.message || `Password reset email sent to ${member.email}`)
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email')
    } finally {
      setSendingReset(null)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'DEVELOPER':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'MEMBER':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'VIEWER':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Check permissions
  if (permissionsLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (!canManageMembers) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">Access Denied</h2>
            <p className="text-red-600 dark:text-red-300">
              You don't have permission to manage team members. Please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="text-[#08163d]" size={28} />
            <div>
              <h1 className="text-3xl font-bold text-[#08163d]">Team Members</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your partner team members</p>
            </div>
          </div>
          {canManageMembers && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#08163d] hover:bg-[#0a1f4f] text-white"
            >
              <UserPlus className="mr-2" size={18} />
              Add Member
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Members Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading members...</div>
          ) : members.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="mx-auto mb-4 text-gray-400" size={48} />
              <p>No team members yet. Add your first member to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {member.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                            member.role
                          )}`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            member.status
                          )}`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          {member.canViewTransactions && (
                            <div>✓ View Transactions</div>
                          )}
                          {member.canManageApiKeys && <div>✓ Manage API Keys</div>}
                          {member.canViewAnalytics && <div>✓ View Analytics</div>}
                          {member.canManageMembers && <div>✓ Manage Members</div>}
                          {member.canConfigureTariffs && <div>✓ Configure Tariffs</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {member.acceptedAt
                          ? new Date(member.acceptedAt).toLocaleDateString()
                          : 'Pending'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {(member.status === 'ACTIVE' ||
                            member.status === 'PENDING') && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenSetPasswordModal(member)}
                                disabled={
                                  settingPassword ||
                                  sendingReset === member.id ||
                                  updating ||
                                  deleting === member.id
                                }
                                className="text-[#08163d] hover:text-[#0a1f4f]"
                                title="Set a new password for this member"
                              >
                                <KeyRound className="mr-1" size={16} />
                                Set password
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendPasswordReset(member)}
                                disabled={
                                  settingPassword ||
                                  sendingReset === member.id ||
                                  updating ||
                                  deleting === member.id
                                }
                                className="text-[#08163d] hover:text-[#0a1f4f]"
                                title="Email a password reset link"
                              >
                                <Mail className="mr-1" size={16} />
                                {sendingReset === member.id ? 'Sending…' : 'Send reset'}
                              </Button>
                            </>
                          )}
                          {member.role !== 'OWNER' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditModal(member)}
                              disabled={updating || deleting === member.id}
                              className="text-[#08163d] hover:text-[#0a1f4f]"
                            >
                              <Pencil className="mr-1" size={16} />
                              Edit
                            </Button>
                          )}
                          {member.role !== 'OWNER' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMember(member.id)}
                              disabled={deleting === member.id || updating}
                              className="text-red-600 hover:text-red-800"
                            >
                              {deleting === member.id ? (
                                'Removing...'
                              ) : (
                                <>
                                  <Trash2 className="mr-1" size={16} />
                                  Remove
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#08163d] dark:text-white">
                  Add Team Member
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false)
                    setFormData({
                      email: '',
                      password: '',
                      firstName: '',
                      lastName: '',
                      phoneNumber: '',
                      role: 'MEMBER',
                    })
                    setError('')
                  }}
                >
                  <X size={20} />
                </Button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="member@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="John"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <Input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="+256700123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="VIEWER">Viewer (Read-only)</option>
                    <option value="MEMBER">Member (Basic access)</option>
                    <option value="DEVELOPER">Developer (API Keys + Analytics)</option>
                    <option value="ADMIN">Admin (Full access)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowAddModal(false)
                      setFormData({
                        email: '',
                        password: '',
                        firstName: '',
                        lastName: '',
                        phoneNumber: '',
                        role: 'MEMBER',
                      })
                      setError('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#08163d] hover:bg-[#0a1f4f] text-white"
                    disabled={adding}
                  >
                    {adding ? 'Adding...' : 'Add Member'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Set Password Modal */}
        {showSetPasswordModal && passwordTargetMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#08163d] dark:text-white">
                  Set Password
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowSetPasswordModal(false)
                    setPasswordTargetMember(null)
                    setSetPasswordForm({ newPassword: '', confirmPassword: '' })
                    setError('')
                  }}
                >
                  <X size={20} />
                </Button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Set a new password for{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {passwordTargetMember.firstName} {passwordTargetMember.lastName}
                </span>{' '}
                ({passwordTargetMember.email}). They will be asked to change it on next login.
              </p>

              <form onSubmit={handleSetMemberPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    value={setPasswordForm.newPassword}
                    onChange={(e) =>
                      setSetPasswordForm({
                        ...setPasswordForm,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    value={setPasswordForm.confirmPassword}
                    onChange={(e) =>
                      setSetPasswordForm({
                        ...setPasswordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Re-enter password"
                    minLength={8}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowSetPasswordModal(false)
                      setPasswordTargetMember(null)
                      setSetPasswordForm({ newPassword: '', confirmPassword: '' })
                      setError('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#08163d] hover:bg-[#0a1f4f] text-white"
                    disabled={settingPassword}
                  >
                    {settingPassword ? 'Saving…' : 'Set password'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Member Modal */}
        {showEditModal && editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#08163d] dark:text-white">
                  Edit Team Member
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingMember(null)
                    setError('')
                  }}
                >
                  <X size={20} />
                </Button>
              </div>

              <form onSubmit={handleEditMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <Input type="email" value={editingMember.email} disabled />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="VIEWER">Viewer (Read-only)</option>
                    <option value="MEMBER">Member (Basic access)</option>
                    <option value="DEVELOPER">Developer (API Keys + Analytics)</option>
                    <option value="ADMIN">Admin (Full access)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Permissions
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={editFormData.canViewTransactions}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          canViewTransactions: e.target.checked,
                        })
                      }
                    />
                    View Transactions
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={editFormData.canManageApiKeys}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          canManageApiKeys: e.target.checked,
                        })
                      }
                    />
                    Manage API Keys
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={editFormData.canViewAnalytics}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          canViewAnalytics: e.target.checked,
                        })
                      }
                    />
                    View Analytics
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={editFormData.canManageMembers}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          canManageMembers: e.target.checked,
                        })
                      }
                    />
                    Manage Members
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={editFormData.canConfigureTariffs}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          canConfigureTariffs: e.target.checked,
                        })
                      }
                    />
                    Configure Tariffs
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingMember(null)
                      setError('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#08163d] hover:bg-[#0a1f4f] text-white"
                    disabled={updating}
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
