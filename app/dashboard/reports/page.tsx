"use client"

import React, { useState, useEffect } from "react"
import { 
  getCustomerCount, 
  getTransactionVolume, 
  getTransactionsByGender, 
  getTransactionsByAmountBands 
} from "@/lib/api"
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Loader2, 
  AlertCircle,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CustomerCountData {
  totalCustomers: number
  newCustomers: number
  startDate: string
  endDate: string
}

interface TransactionVolumeData {
  totalVolume: number
  totalCount: number
  averageAmount: number
  currency: string
  startDate: string
  endDate: string
  status?: string
}

interface GenderStats {
  gender: string
  totalVolume: number
  totalCount: number
  averageAmount: number
}

interface GenderData {
  genderStats: GenderStats[]
  totalVolume: number
  totalCount: number
  startDate: string
  endDate: string
  status?: string
}

interface AmountBandStats {
  minAmount: number
  maxAmount: number
  totalVolume: number
  totalCount: number
  averageAmount: number
}

interface AmountBandData {
  bandStats: AmountBandStats[]
  totalVolume: number
  totalCount: number
  startDate: string
  endDate: string
  status?: string
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Date range state
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [currencyFilter, setCurrencyFilter] = useState<string>("UGX")
  
  // Data state
  const [customerData, setCustomerData] = useState<CustomerCountData | null>(null)
  const [volumeData, setVolumeData] = useState<TransactionVolumeData | null>(null)
  const [genderData, setGenderData] = useState<GenderData | null>(null)
  const [amountBandData, setAmountBandData] = useState<AmountBandData | null>(null)
  
  // Amount bands configuration
  const [amountBands, setAmountBands] = useState([
    { minAmount: 0, maxAmount: 10000 },
    { minAmount: 10001, maxAmount: 50000 },
    { minAmount: 50001, maxAmount: 100000 },
    { minAmount: 100001, maxAmount: 500000 },
    { minAmount: 500001, maxAmount: 1000000 },
    { minAmount: 1000001, maxAmount: Infinity }
  ])

  const formatCurrency = (amount: number, currency: string = "UGX") => {
    if (currency === "UGX") {
      return `${amount.toLocaleString('en-US')} ${currency}`
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const fetchAllReports = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const startDateTime = new Date(startDate).toISOString()
      const endDateTime = new Date(endDate + 'T23:59:59').toISOString()
      
      // Fetch all reports in parallel
      const [customers, volume, gender, bands] = await Promise.all([
        getCustomerCount(startDateTime, endDateTime),
        getTransactionVolume({
          startDate: startDateTime,
          endDate: endDateTime,
          status: statusFilter || undefined,
          currency: currencyFilter || undefined,
        }),
        getTransactionsByGender({
          startDate: startDateTime,
          endDate: endDateTime,
          status: statusFilter || undefined,
          currency: currencyFilter || undefined,
        }),
        getTransactionsByAmountBands({
          startDate: startDateTime,
          endDate: endDateTime,
          status: statusFilter || undefined,
          currency: currencyFilter || undefined,
          amountBands: amountBands.map(band => ({
            minAmount: band.minAmount,
            maxAmount: band.maxAmount === Infinity ? 999999999 : band.maxAmount
          }))
        })
      ])
      
      setCustomerData(customers)
      setVolumeData(volume)
      setGenderData(gender)
      setAmountBandData(bands)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reports')
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllReports()
  }, [])

  const handleGenerateReport = () => {
    fetchAllReports()
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#08163d]">Finance Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive financial analytics and insights</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-[#08163d]" />
          <h2 className="text-lg font-semibold text-[#08163d]">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Currencies</option>
              <option value="UGX">UGX</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-[#08163d] hover:bg-[#0a1f4f] text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading && !customerData && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#08163d]" />
        </div>
      )}

      {/* Customer Count Card */}
      {customerData && (
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-[#08163d]" />
            <h2 className="text-lg font-semibold text-[#08163d]">Customer Registration</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-[#08163d]">{customerData.totalCustomers.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">New Customers (Period)</p>
              <p className="text-2xl font-bold text-green-700">{customerData.newCustomers.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Period: {formatDate(customerData.startDate)} - {formatDate(customerData.endDate)}
          </p>
        </div>
      )}

      {/* Transaction Volume Card */}
      {volumeData && (
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-[#08163d]" />
            <h2 className="text-lg font-semibold text-[#08163d]">Transaction Volume</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-xl font-bold text-[#08163d]">
                {formatCurrency(volumeData.totalVolume, volumeData.currency)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-xl font-bold text-purple-700">
                {volumeData.totalCount.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Average Amount</p>
              <p className="text-xl font-bold text-green-700">
                {formatCurrency(volumeData.averageAmount, volumeData.currency)}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {volumeData.status && `Status: ${volumeData.status} • `}
            Period: {formatDate(volumeData.startDate)} - {formatDate(volumeData.endDate)}
          </p>
        </div>
      )}

      {/* Gender Statistics */}
      {genderData && (
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#08163d]" />
            <h2 className="text-lg font-semibold text-[#08163d]">Transactions by Gender</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Gender</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Volume</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Transaction Count</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Average Amount</th>
                </tr>
              </thead>
              <tbody>
                {genderData.genderStats.map((stat, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{stat.gender}</td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(stat.totalVolume, currencyFilter || "UGX")}
                    </td>
                    <td className="py-3 px-4 text-right">{stat.totalCount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(stat.averageAmount, currencyFilter || "UGX")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4">Total</td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(genderData.totalVolume, currencyFilter || "UGX")}
                  </td>
                  <td className="py-3 px-4 text-right">{genderData.totalCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Amount Bands Statistics */}
      {amountBandData && (
        <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-[#08163d]" />
            <h2 className="text-lg font-semibold text-[#08163d]">Transactions by Amount Bands</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount Range</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Volume</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Transaction Count</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Average Amount</th>
                </tr>
              </thead>
              <tbody>
                {amountBandData.bandStats.map((stat, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      {formatCurrency(stat.minAmount, currencyFilter || "UGX")} - {
                        stat.maxAmount === 999999999 
                          ? "∞" 
                          : formatCurrency(stat.maxAmount, currencyFilter || "UGX")
                      }
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(stat.totalVolume, currencyFilter || "UGX")}
                    </td>
                    <td className="py-3 px-4 text-right">{stat.totalCount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(stat.averageAmount, currencyFilter || "UGX")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4">Total</td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(amountBandData.totalVolume, currencyFilter || "UGX")}
                  </td>
                  <td className="py-3 px-4 text-right">{amountBandData.totalCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
