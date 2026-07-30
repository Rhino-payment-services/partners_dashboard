'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Store, Plus, X, AlertCircle, Pencil } from 'lucide-react'
import {
  listPartnerMerchants,
  registerPartnerMerchant,
  updatePartnerMerchant,
  type PartnerMerchant,
} from '@/lib/api'

const INDUSTRIES = [
  'Betting',
  'E-commerce',
  'Retail',
  'Supermarket',
  'Pharmacy',
  'Fuel Station',
  'Utility Services',
  'Education',
  'SACCO',
  'Microfinance',
  'Other',
] as const

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<PartnerMerchant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editing, setEditing] = useState<PartnerMerchant | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    merchantName: '',
    industry: 'Other',
    contactEmail: '',
    contactPhone: '',
    contactPerson: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  })

  useEffect(() => {
    loadMerchants()
  }, [])

  const loadMerchants = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await listPartnerMerchants()
      setMerchants(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message || 'Failed to load merchants')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      merchantName: '',
      industry: 'Other',
      contactEmail: '',
      contactPhone: '',
      contactPerson: '',
      status: 'ACTIVE',
    })
    setEditing(null)
  }

  const openEdit = (merchant: PartnerMerchant) => {
    setEditing(merchant)
    setFormData({
      merchantName: merchant.merchantName,
      industry: merchant.industry || 'Other',
      contactEmail: merchant.contactEmail || '',
      contactPhone: merchant.contactPhone || '',
      contactPerson: merchant.contactPerson || '',
      status:
        merchant.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    })
    setShowAddModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.merchantName.trim()) {
      setError('Merchant name is required')
      return
    }

    try {
      setSaving(true)
      if (editing) {
        if (editing.status === 'BLOCKED') {
          setError('Blocked merchants cannot be edited here. Contact RukaPay support.')
          return
        }
        await updatePartnerMerchant(editing.merchantId, {
          merchantName: formData.merchantName.trim(),
          industry: formData.industry,
          contactEmail: formData.contactEmail || undefined,
          contactPhone: formData.contactPhone || undefined,
          contactPerson: formData.contactPerson || undefined,
          status: formData.status,
        })
        setSuccess('Merchant updated successfully')
      } else {
        await registerPartnerMerchant({
          merchantName: formData.merchantName.trim(),
          industry: formData.industry,
          contactEmail: formData.contactEmail || undefined,
          contactPhone: formData.contactPhone || undefined,
          contactPerson: formData.contactPerson || undefined,
        })
        setSuccess('Merchant registered successfully')
      }
      setShowAddModal(false)
      resetForm()
      await loadMerchants()
    } catch (err: any) {
      setError(err.message || 'Failed to save merchant')
    } finally {
      setSaving(false)
    }
  }

  const statusBadge = (status: string) => {
    const s = status.toUpperCase()
    if (s === 'ACTIVE') return 'bg-green-100 text-green-800'
    if (s === 'INACTIVE') return 'bg-gray-100 text-gray-800'
    if (s === 'BLOCKED') return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Store className="text-[#08163d]" size={28} />
            <div>
              <h1 className="text-3xl font-bold text-[#08163d]">Merchants</h1>
              <p className="text-sm text-gray-500 mt-1">
                Register and manage merchants under your partner account
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="bg-[#08163d] hover:bg-[#0a1f4f] text-white"
          >
            <Plus className="mr-2" size={18} />
            Register Merchant
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading merchants...</div>
          ) : merchants.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto mb-3 text-gray-400" size={40} />
              <p className="text-gray-600">No merchants found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                      Merchant
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                      Industry
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                      Contact
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {merchants.map((merchant) => (
                    <tr key={merchant.id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#08163d]">
                          {merchant.merchantName}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {merchant.merchantId}
                          {merchant.isBaseMerchant ? ' · Base' : ''}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{merchant.industry}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusBadge(merchant.status)}`}
                        >
                          {merchant.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {merchant.contactEmail || merchant.contactPhone || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={merchant.status === 'BLOCKED'}
                          onClick={() => openEdit(merchant)}
                        >
                          <Pencil size={14} className="mr-1" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#08163d]">
                {editing ? 'Update Merchant' : 'Register Merchant'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Merchant name *</label>
                <Input
                  value={formData.merchantName}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, merchantName: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industry *</label>
                <select
                  className="w-full border rounded-md h-10 px-3"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, industry: e.target.value }))
                  }
                >
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact email</label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, contactEmail: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact phone</label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, contactPhone: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact person</label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, contactPerson: e.target.value }))
                  }
                />
              </div>
              {editing && (
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full border rounded-md h-10 px-3"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        status: e.target.value as 'ACTIVE' | 'INACTIVE',
                      }))
                    }
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#08163d] hover:bg-[#0a1f4f] text-white"
                >
                  {saving ? 'Saving...' : editing ? 'Save changes' : 'Register'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
