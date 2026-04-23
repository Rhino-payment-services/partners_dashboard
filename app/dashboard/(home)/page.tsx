"use client"
import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, ArrowDownCircle, PlusCircle, KeyRound, FileText, TrendingUp, CreditCard, AlertCircle, Users, Zap, Building2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import type { TooltipProps } from 'recharts'
import { Button } from '@/components/ui/button'
import { getPartnerProfile, getPartnerTransactions, getPartnerTransactionVolume } from '@/lib/api'

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
  const [chartRange, setChartRange] = useState<'weekly' | 'yearly'>('weekly')
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const [chartData, setChartData] = useState<Array<{ day: string; success: number; failed: number }>>([])
  const [isLoadingChart, setIsLoadingChart] = useState(true)
  
  // Fetch partner profile
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

  // Fetch recent transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoadingTransactions(true)
        const result = await getPartnerTransactions({ page: 1, pageSize: 5 })
        setRecentTransactions(result.items || [])
      } catch (error: any) {
        console.error('Error fetching transactions:', error)
        // Don't show error, just leave empty
      } finally {
        setIsLoadingTransactions(false)
      }
    }
    
    fetchTransactions()
  }, [])

  // Fetch transaction volume for chart
  // useEffect(() => {
  //   const fetchChartData = async () => {
  //     try {
  //       setIsLoadingChart(true)
  //       const days = chartRange === 'weekly' ? 7 : 30
  //       const data = await getPartnerTransactionVolume(days)
  //       console.log('Chart data received:', data)
  //       console.log('Chart data length:', data?.length)
  //       if (data && data.length > 0) {
  //         console.log('First item:', data[0])
  //         console.log('Sample data:', data.slice(0, 3))
  //       }
  //       setChartData(data || [])
  //     } catch (error: any) {
  //       console.error('Error fetching chart data:', error)
  //       setChartData([])
  //     } finally {
  //       setIsLoadingChart(false)
  //     }
  //   }
    
  //   fetchChartData()
  // }, [chartRange])
  
  // Get primary wallet balance (ESCROW wallet)
  const primaryWallet = partnerProfile?.wallets?.find(w => w.walletType === 'ESCROW') || partnerProfile?.wallets?.[0]
  const balance = primaryWallet?.balance ?? 0
  const partnerName = partnerProfile?.partner?.partnerName ?? null
  const partnerTier = partnerProfile?.partner?.tier ?? null
  const totalWallets = partnerProfile?.wallets?.length ?? 0
  const activeApiKeys = partnerProfile?.apiKeys?.length ?? 0
  
  // Defensive check: Ensure we never access merchant_names which doesn't exist
  // If any code tries to access merchant_names, it will be undefined
  // Use optional chaining everywhere: user?.profile?.merchant_names should be user?.userData?.merchant?.businessTradeName
  const analytics = [
    { label: 'Partner Name', value: partnerName || 'N/A', icon: <Building2 className='text-blue-500' size={24} /> },
    { label: 'Partner Tier', value: partnerTier || 'N/A', icon: <TrendingUp className='text-green-500' size={24} /> },
    { label: 'Active Wallets', value: totalWallets.toString(), icon: <CreditCard className='text-yellow-500' size={24} /> },
    { label: 'API Keys', value: activeApiKeys.toString(), icon: <KeyRound className='text-purple-500' size={24} /> },
  ]
  const activityFeed = [
    { id: 1, text: 'Withdrawal request approved', time: '2 hours ago' },
    { id: 2, text: 'API key generated', time: '5 hours ago' },
    { id: 3, text: 'Payment received: UGX 500,000', time: '1 day ago' },
    { id: 4, text: 'Invoice sent to client', time: '2 days ago' },
  ]
  // Custom tooltip for chart
  const ChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-500 mb-2">{payload[0].payload.day}</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="text-sm mb-1">
              <span style={{ color: entry.color }} className="font-semibold">
                {entry.name === 'success' ? 'Success' : 'Failed'}: UGX {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <main className='flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-7xl'>
        {/* Partner Info & Wallet Balance Card */}
        <div className='bg-white rounded-2xl shadow-md p-6 mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <div className='text-gray-500 text-sm mb-1'>
                {isLoadingProfile ? 'Loading...' : partnerProfile ? (
                  <>
                    Partner: <span className='font-semibold text-[#08163d]'>{partnerProfile.partner.partnerName}</span>
                    {partnerProfile.partner.tier && (
                      <span className='ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded'>{partnerProfile.partner.tier}</span>
                    )}
                  </>
                ) : (
                  'Partner Information'
                )}
              </div>
              {partnerProfile && (
                <div className='text-xs text-gray-400 mt-1'>
                  {partnerProfile.partner.contactEmail} • {partnerProfile.partner.country || 'N/A'}
                </div>
              )}
            </div>
            {partnerProfile && (
              <div className='text-right'>
                <div className='text-xs text-gray-500'>Status</div>
                <div className={`text-sm font-semibold ${partnerProfile.partner.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {partnerProfile.partner.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            )}
          </div>
          
          {/* Wallet Balances */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {partnerProfile?.wallets
              ?.filter((wallet) => String(wallet.walletType || '').toUpperCase() !== 'COMMISSION')
              .map((wallet) => (
              <div key={wallet.id} className='bg-gray-50 rounded-lg p-4'>
                <div className='text-gray-500 text-sm mb-1'>
                  {wallet.walletType} Wallet ({wallet.currency})
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-2xl font-bold text-[#08163d]'>
                    {showBalance ? `${wallet.currency} ${wallet.balance.toLocaleString()}` : '•••••••'}
                  </span>
                  <button onClick={() => setShowBalance(v => !v)} className='text-gray-400 hover:text-[#08163d] transition'>
                    {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {wallet.isSuspended && (
                  <div className='text-xs text-red-600 mt-1'>Suspended</div>
                )}
              </div>
            ))}
            {isLoadingProfile && (
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='text-gray-500 text-sm mb-1'>Loading wallet...</div>
                <div className='text-2xl font-bold text-[#08163d]'>---</div>
              </div>
            )}
            {profileError && !partnerProfile && (
              <div className='bg-red-50 rounded-lg p-4'>
                <div className='text-red-600 text-sm'>{profileError}</div>
              </div>
            )}
          </div>
        </div>
        {/* Analytics Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
          {analytics.map((item, idx) => (
            <div key={idx} className='bg-white rounded-xl shadow p-5 flex items-center gap-4'>
              <div className='bg-gray-100 rounded-full p-3'>{item.icon}</div>
              <div>
                <div className='text-gray-500 text-xs'>{item.label}</div>
                <div className='font-bold text-lg text-[#08163d]'>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Chart & Activity Feed */}
        <div className='grid grid-cols-1 gap-6 mb-8'>
          {/* Modern Bar Chart with recharts */}
          {/* <div className='bg-white rounded-xl shadow p-5 h-[40vh] col-span-1 md:col-span-2 flex flex-col'>
            <div className='flex items-center justify-between mb-2'>
              <div className='font-semibold text-[#08163d]'>Transaction Volume ({chartRange === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'})</div>
              <div className='flex gap-2'>
                <Button variant={chartRange === 'weekly' ? 'default' : 'outline'} size='sm' onClick={() => setChartRange('weekly')}>
                  Weekly
                </Button>
                <Button variant={chartRange === 'yearly' ? 'default' : 'outline'} size='sm' onClick={() => setChartRange('yearly')}>
                  Monthly
                </Button>
              </div>
            </div>
            <div className='flex-1 w-full'>
              {isLoadingChart ? (
                <div className='flex items-center justify-center h-full text-gray-500 text-sm'>
                  Loading chart data...
                </div>
              ) : chartData.length === 0 ? (
                <div className='flex items-center justify-center h-full text-gray-500 text-sm'>
                  No transaction data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={v => `UGX ${v/1000000}M`} 
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                    <Legend 
                      wrapperStyle={{ paddingTop: '10px' }}
                      iconType="square"
                      formatter={(value) => value === 'success' ? 'Success' : 'Failed'}
                    />
                    <Bar 
                      dataKey="success" 
                      fill="#10b981" 
                      radius={[8, 8, 0, 0]} 
                      name="success"
                    />
                    <Bar 
                      dataKey="failed" 
                      fill="#ef4444" 
                      radius={[8, 8, 0, 0]} 
                      name="failed"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div> */}
          {/* Activity Feed */}
          {/* <div className='bg-white rounded-xl shadow p-5 flex flex-col'>
            <div className='font-semibold text-[#08163d] mb-2'>Activity Feed</div>
            <ul className='flex-1 space-y-3'>
              {activityFeed.map(item => (
                <li key={item.id} className='flex items-center gap-2 text-sm'>
                  <Zap className='text-yellow-500' size={16} />
                  <span className='text-[#08163d]'>{item.text}</span>
                  <span className='ml-auto text-gray-400 text-xs'>{item.time}</span>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
        {/* Quick Links/Shortcuts */}
        {/* <div className='flex flex-wrap gap-4 mb-8'>
          <button className='flex items-center gap-2 bg-blue-100 text-[#08163d] px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition'>
            <PlusCircle size={18} /> Create Invoice
          </button>
          <button className='flex items-center gap-2 bg-green-100 text-[#08163d] px-4 py-2 rounded-lg font-medium hover:bg-green-200 transition'>
            <KeyRound size={18} /> View API Keys
          </button>
          <button className='flex items-center gap-2 bg-yellow-100 text-[#08163d] px-4 py-2 rounded-lg font-medium hover:bg-yellow-200 transition'>
            <FileText size={18} /> Reports
          </button>
          <button className='flex items-center gap-2 bg-gray-100 text-[#08163d] px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition'>
            <Users size={18} /> Customers
          </button>
        </div> */}
        {/* Recent Transactions */}
        <div className='bg-white rounded-2xl shadow-md p-6'>
          <div className='font-semibold text-lg mb-4 text-[#08163d]'>Recent Transactions</div>
          {isLoadingTransactions ? (
            <div className='py-8 text-center text-gray-500 text-sm'>Loading transactions...</div>
          ) : recentTransactions.length === 0 ? (
            <div className='py-8 text-center text-gray-500 text-sm'>No recent transactions</div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='text-gray-500 text-xs uppercase border-b'>
                    <th className='py-2 pr-4'>Date</th>
                    <th className='py-2 pr-4'>Reference</th>
                    <th className='py-2 pr-4'>Amount</th>
                    <th className='py-2 pr-4'>Type</th>
                    <th className='py-2 pr-4'>Status</th>
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
                      <tr key={tx.id} className='border-b last:border-b-0 hover:bg-gray-50'>
                        <td className='py-2 pr-4 align-top text-xs text-gray-500'>
                          <div>{dateStr}</div>
                          <div>{timeStr}</div>
                        </td>
                        <td className='py-2 pr-4 align-top'>
                          <div className='font-mono text-xs text-[#08163d] truncate max-w-[180px]'>
                            {tx.reference || tx.externalReference || '—'}
                          </div>
                          {tx.description && (
                            <div className='text-[11px] text-gray-500 truncate max-w-[220px]'>
                              {tx.description}
                            </div>
                          )}
                        </td>
                        <td className='py-2 pr-4 align-top text-sm font-semibold text-[#08163d]'>
                          {tx.currency} {tx.amount.toLocaleString()}
                          {tx.fee > 0 && (
                            <div className='text-[11px] text-gray-400'>Fee: {tx.currency} {tx.fee.toLocaleString()}</div>
                          )}
                        </td>
                        <td className='py-2 pr-4 align-top text-xs text-gray-600'>{tx.type}</td>
                        <td className='py-2 pr-4 align-top text-xs'>
                          <span
                            className={
                              'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ' +
                              (isSuccess
                                ? 'bg-green-100 text-green-700'
                                : isPending
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700')
                            }
                          >
                            {tx.status}
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