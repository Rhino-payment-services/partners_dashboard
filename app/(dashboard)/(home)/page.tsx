"use client"
import React, { useState } from 'react'
import NavaBar from '@/components/NavaBar'
import { Eye, EyeOff, ArrowDownCircle, PlusCircle, KeyRound, FileText, TrendingUp, CreditCard, AlertCircle, Users, Zap } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { TooltipProps } from 'recharts'
import { Button } from '@/components/ui/button'

// Custom Tooltip for recharts
const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow p-3 border border-gray-200">
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        <div className="font-bold text-[#08163d] text-base">UGX {payload[0].value.toLocaleString()}</div>
      </div>
    )
  }
  return null
}

function Home() {
  const [showBalance, setShowBalance] = useState(true)
  const [chartRange, setChartRange] = useState<'weekly' | 'yearly'>('weekly')
  const balance = 12500.75
  const analytics = [
    { label: 'Total Collections', value: 'UGX 50,000,000', icon: <TrendingUp className='text-blue-500' size={24} /> },
    { label: 'Today’s Revenue', value: 'UGX 1,200,000', icon: <CreditCard className='text-green-500' size={24} /> },
    { label: 'Pending Withdrawals', value: '2', icon: <AlertCircle className='text-yellow-500' size={24} /> },
    { label: 'Failed Transactions', value: '1', icon: <AlertCircle className='text-red-500' size={24} /> },
  ]
  const activityFeed = [
    { id: 1, text: 'Withdrawal request approved', time: '2 hours ago' },
    { id: 2, text: 'API key generated', time: '5 hours ago' },
    { id: 3, text: 'Payment received: UGX 500,000', time: '1 day ago' },
    { id: 4, text: 'Invoice sent to client', time: '2 days ago' },
  ]
  const recentTransactions = [
    { id: 'TXN001', date: '2024-06-01', amount: 2500, status: 'Completed' },
    { id: 'TXN002', date: '2024-05-30', amount: 1200, status: 'Pending' },
    { id: 'TXN003', date: '2024-05-28', amount: 5000, status: 'Completed' },
    { id: 'TXN004', date: '2024-05-25', amount: 800, status: 'Failed' },
    { id: 'TXN005', date: '2024-05-22', amount: 3000, status: 'Completed' },
  ]
  const chartDataWeekly = [
    { day: 'Mon', volume: 4000000 },
    { day: 'Tue', volume: 6000000 },
    { day: 'Wed', volume: 3000000 },
    { day: 'Thu', volume: 8000000 },
    { day: 'Fri', volume: 5500000 },
    { day: 'Sat', volume: 7000000 },
    { day: 'Sun', volume: 5000000 },
  ]
  const chartDataYearly = [
    { month: 'Jan', volume: 20000000 },
    { month: 'Feb', volume: 25000000 },
    { month: 'Mar', volume: 18000000 },
    { month: 'Apr', volume: 30000000 },
    { month: 'May', volume: 22000000 },
    { month: 'Jun', volume: 27000000 },
    { month: 'Jul', volume: 32000000 },
    { month: 'Aug', volume: 29000000 },
    { month: 'Sep', volume: 31000000 },
    { month: 'Oct', volume: 28000000 },
    { month: 'Nov', volume: 35000000 },
    { month: 'Dec', volume: 10000000 },
  ]
  const chartData = chartRange === 'weekly' ? chartDataWeekly : chartDataYearly

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <NavaBar />
      <main className='flex-1 p-8 mx-auto w-full'>
        {/* Wallet Balance Card */}
        <div className='bg-white rounded-2xl shadow-md p-6 flex items-center justify-between mb-8'>
          <div>
            <div className='text-gray-500 text-sm mb-1'>Wallet Balance</div>
            <div className='flex items-center gap-3'>
              <span className='text-3xl font-bold text-[#08163d]'>
                {showBalance ? `UGX ${balance.toLocaleString()}` : '•••••••'}
              </span>
              <button onClick={() => setShowBalance(v => !v)} className='text-gray-400 hover:text-[#08163d] transition'>
                {showBalance ? <Eye size={22} /> : <EyeOff size={22} />}
              </button>
            </div>
          </div>
          <button className='flex items-center gap-2 bg-[#08163d] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#122a5c] transition'>
            <ArrowDownCircle size={20} /> Withdraw
          </button>
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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {/* Modern Bar Chart with recharts */}
          <div className='bg-white rounded-xl shadow p-5 h-[40vh] col-span-1 md:col-span-2 flex flex-col'>
            <div className='flex items-center justify-between mb-2'>
              <div className='font-semibold text-[#08163d]'>Transaction Volume ({chartRange === 'weekly' ? 'Last 7 Days' : 'Year'})</div>
              <div className='flex gap-2'>
                <Button variant={chartRange === 'weekly' ? 'default' : 'outline'} size='sm' onClick={() => setChartRange('weekly')}>
                  Weekly
                </Button>
                <Button variant={chartRange === 'yearly' ? 'default' : 'outline'} size='sm' onClick={() => setChartRange('yearly')}>
                  Yearly
                </Button>
              </div>
            </div>
            <div className='flex-1 w-full'>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  {chartRange === 'weekly' ? (
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  ) : (
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  )}
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `UGX ${v/1000000}M`} />
                  <Tooltip content={(props) => <CustomTooltip {...props} />} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="volume" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Activity Feed */}
          <div className='bg-white rounded-xl shadow p-5 flex flex-col'>
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
          </div>
        </div>
        {/* Quick Links/Shortcuts */}
        <div className='flex flex-wrap gap-4 mb-8'>
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
        </div>
        {/* Recent Transactions */}
        <div className='bg-white rounded-2xl shadow-md p-6'>
          <div className='font-semibold text-lg mb-4 text-[#08163d]'>Recent Transactions</div>
          <table className='w-full text-left'>
            <thead>
              <tr className='text-gray-500 text-sm'>
                <th className='py-2'>ID</th>
                <th className='py-2'>Date</th>
                <th className='py-2'>Amount</th>
                <th className='py-2'>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(txn => (
                <tr key={txn.id} className='border-t last:border-b-0'>
                  <td className='py-2'>{txn.id}</td>
                  <td className='py-2'>{txn.date}</td>
                  <td className='py-2'>UGX {txn.amount.toLocaleString()}</td>
                  <td className={`py-2 font-medium ${txn.status === 'Completed' ? 'text-green-600' : txn.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}`}>{txn.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Home