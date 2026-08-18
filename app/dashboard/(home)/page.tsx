"use client"
import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, KeyRound, TrendingUp, CreditCard, Building2 } from 'lucide-react'
import { getPartnerProfile, getPartnerTransactions } from '@/lib/api'

interface PartnerProfile {
  user: {
    id: string
    email: string
    phone: string | null
    status: string
    isVerified: boolean
    createdAt: string
    lastLoginAt: string | null
  }
  partner: {
    id: string
    partnerName: string
    partnerType: string
    contactEmail: string
    contactPhone: string | null
    contactPerson: string | null
    tier: string
    country: string | null
    isActive: boolean
    isSuspended: boolean
    createdAt: string
    showEscrowCommissionBalancesOnTransactions?: boolean
  }
  wallets: Array<{
    id: string
    walletType: string
    currency: string
    balance: number
    isActive: boolean
    isSuspended: boolean
  }>
  apiKeys: Array<{
    id: string
    keyPrefix: string
    description: string | null
    environment: string
    expiresAt: string | null
    lastUsedAt: string | null
    createdAt: string
  }>
}

interface Transaction {
  id: string
  reference: string | null
  externalReference: string | null
  type: string
  status: string
  amount: number
  currency: string
  fee: number
  netAmount: number
  direction: string | null
  mode: string | null
  channel: string | null
  description: string | null
  createdAt: string
  processedAt: string | null
}

function Home() {
  const [showBalance, setShowBalance] = useState(true)
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true)
        setProfileError(null)
        const data = await getPartnerProfile()
        setPartnerProfile(data)
      } catch (error: any) {
        console.error('Error fetching partner profile:', error)
        setProfileError(error.message || 'Failed to load partner profile')
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoadingTransactions(true)
        const result = await getPartnerTransactions({ page: 1, pageSize: 5 })
        setRecentTransactions(result.items || [])
      } catch (error: any) {
        console.error('Error fetching transactions:', error)
      } finally {
        setIsLoadingTransactions(false)
      }
    }

    fetchTransactions()
  }, [])

  const showCommissionWallet = Boolean(
    partnerProfile?.partner?.showEscrowCommissionBalancesOnTransactions,
  )
  const visibleWallets = (partnerProfile?.wallets || []).filter((wallet) => {
    const type = String(wallet.walletType || '').toUpperCase()
    if (type === 'COMMISSION') return showCommissionWallet
    return true
  })

  const partnerName = partnerProfile?.partner?.partnerName ?? null
  const partnerTier = partnerProfile?.partner?.tier ?? null
  const totalWallets = partnerProfile?.wallets?.length ?? 0
  const activeApiKeys = partnerProfile?.apiKeys?.length ?? 0

  const analytics = [
    { label: 'Partner Name', value: partnerName || 'N/A', icon: <Building2 className="text-blue-500" size={18} /> },
    { label: 'Partner Tier', value: partnerTier || 'N/A', icon: <TrendingUp className="text-green-500" size={18} /> },
    { label: 'Active Wallets', value: totalWallets.toString(), icon: <CreditCard className="text-yellow-500" size={18} /> },
    { label: 'API Keys', value: activeApiKeys.toString(), icon: <KeyRound className="text-purple-500" size={18} /> },
  ]

  return (
    <div className="flex min-h-full min-w-0 flex-col bg-[#f8f9fb]">
      <main className="mx-auto w-full min-w-0 max-w-[1600px] flex-1 p-4 md:p-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-[#08163d]">Dashboard</h1>
          <p className="mt-1 text-xs text-slate-500">
            Overview of your partner account, wallets, and recent activity.
          </p>
        </div>

        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">
                {isLoadingProfile ? 'Loading...' : partnerProfile ? (
                  <>
                    Partner:{' '}
                    <span className="font-semibold text-[#08163d]">{partnerProfile.partner.partnerName}</span>
                    {partnerProfile.partner.tier && (
                      <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-700">
                        {partnerProfile.partner.tier}
                      </span>
                    )}
                  </>
                ) : (
                  'Partner Information'
                )}
              </div>
              {partnerProfile && (
                <div className="mt-1 text-[10px] text-slate-400">
                  {partnerProfile.partner.contactEmail} • {partnerProfile.partner.country || 'N/A'}
                </div>
              )}
            </div>
            {partnerProfile && (
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wide text-slate-400">Status</div>
                <div className={`text-xs font-semibold ${partnerProfile.partner.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {partnerProfile.partner.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {visibleWallets.map((wallet) => (
              <div key={wallet.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  {wallet.walletType} Wallet ({wallet.currency})
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-semibold text-[#08163d]">
                    {showBalance ? `${wallet.currency} ${wallet.balance.toLocaleString()}` : '•••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBalance((v) => !v)}
                    className="text-slate-400 transition hover:text-[#08163d]"
                  >
                    {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {wallet.isSuspended && (
                  <div className="mt-1 text-[10px] text-rose-600">Suspended</div>
                )}
              </div>
            ))}
            {isLoadingProfile && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-400">Loading wallet...</div>
                <div className="text-xl font-semibold text-[#08163d]">---</div>
              </div>
            )}
            {profileError && !partnerProfile && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <div className="text-xs text-rose-600">{profileError}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {analytics.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="rounded-full bg-slate-50 p-2.5">{item.icon}</div>
              <div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400">{item.label}</div>
                <div className="text-sm font-semibold text-[#08163d]">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden bg-white">
          <div className="border-b border-slate-200 px-3 py-3">
            <div className="text-sm font-semibold text-[#08163d]">Recent Transactions</div>
          </div>
          {isLoadingTransactions ? (
            <div className="py-14 text-center text-xs text-slate-500">Loading transactions...</div>
          ) : recentTransactions.length === 0 ? (
            <div className="py-14 text-center text-xs text-slate-500">No recent transactions</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full whitespace-nowrap text-left">
                <thead className="bg-slate-50/95">
                  <tr className="border-b border-slate-200 text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-3 py-2.5">Reference</th>
                    <th className="px-3 py-2.5">Amount</th>
                    <th className="px-3 py-2.5">Type</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => {
                    const created = new Date(tx.createdAt)
                    const dateStr = created.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    })
                    const timeStr = created.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })

                    const isSuccess = tx.status === 'SUCCESS' || tx.status === 'COMPLETED'
                    const isPending = tx.status === 'PENDING' || tx.status === 'PROCESSING'

                    return (
                      <tr key={tx.id} className="border-b border-slate-100 last:border-b-0 hover:bg-[#fafbfe]">
                        <td className="px-3 py-3 align-top text-[10px] text-slate-500">
                          <div className="font-medium text-slate-600">{dateStr}</div>
                          <div className="mt-0.5 text-[9px] text-slate-400">{timeStr}</div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <div className="max-w-[180px] truncate font-mono text-[10px] font-medium text-[#08163d]">
                            {tx.reference || tx.externalReference || '—'}
                          </div>
                          {tx.description && (
                            <div className="mt-0.5 max-w-[220px] truncate text-[9px] text-slate-400">
                              {tx.description}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3 align-top text-[11px] font-semibold text-[#08163d]">
                          {tx.currency} {tx.amount.toLocaleString()}
                          {tx.fee > 0 && (
                            <div className="mt-0.5 text-[9px] font-normal text-slate-400">
                              Fee {tx.currency} {tx.fee.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3 align-top text-[10px] font-medium capitalize text-slate-600">
                          {tx.type.toLowerCase().replaceAll('_', ' ')}
                        </td>
                        <td className="px-3 py-3 align-top">
                          <span
                            className={
                              'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-semibold capitalize ' +
                              (isSuccess
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : isPending
                                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                                  : 'border-rose-200 bg-rose-50 text-rose-700')
                            }
                          >
                            <span className="size-1 rounded-full bg-current" />
                            {tx.status.toLowerCase()}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
