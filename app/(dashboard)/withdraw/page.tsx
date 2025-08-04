"use client"
import React, { useState } from 'react'
import NavaBar from '@/components/NavaBar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Wallet, Banknote, Smartphone, ArrowDownCircle, CheckCircle, Clock, XCircle } from 'lucide-react'

const walletBalance = 12500.75
const recentWithdrawals = [
  { id: 'WD001', amount: 5000, date: '2024-06-01', time: '10:30 AM', method: 'Bank', details: '1234567890', status: 'Completed' },
  { id: 'WD002', amount: 2000, date: '2024-05-28', time: '03:15 PM', method: 'Mobile Money', details: '+256 700 123456', status: 'Pending' },
  { id: 'WD003', amount: 3000, date: '2024-05-20', time: '09:45 AM', method: 'Bank', details: '9876543210', status: 'Failed' },
]

const bankOptions = [
  { value: '', label: 'Select a bank' },
  { value: 'stanbic', label: 'Stanbic Bank' },
  { value: 'equity', label: 'Equity Bank' },
  { value: 'centenary', label: 'Centenary Bank' },
  { value: 'absa', label: 'ABSA Bank' },
  { value: 'dtb', label: 'DTB Bank' },
]

function WithdrawPage() {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('Bank')
  const [details, setDetails] = useState('')
  const [bank, setBank] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (method === 'Bank' && !bank) {
      alert('Please select a bank.')
      return
    }
    // Placeholder: handle withdrawal request
    alert('Withdrawal requested!')
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <NavaBar />
      <main className='flex-1 p-8 mx-auto w-full max-w-6xl'>
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <ArrowDownCircle className='text-[#08163d]' size={28} />
            <h1 className='font-bold text-2xl text-[#08163d]'>Request Withdrawal</h1>
          </div>
          <div className='bg-white rounded-xl shadow p-4 flex items-center gap-3 mb-6'>
            <Wallet className='text-blue-500' size={28} />
            <div>
              <div className='text-gray-500 text-xs'>Wallet Balance</div>
              <div className='font-bold text-lg text-[#08163d]'>UGX {walletBalance.toLocaleString()}</div>
            </div>
          </div>
          <form className='bg-white rounded-xl shadow p-6 flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <label className='block text-sm font-medium text-[#08163d] mb-1'>Amount</label>
              <Input
                type='number'
                min='1'
                max={walletBalance}
                placeholder='Enter amount to withdraw'
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-[#08163d] mb-1'>Withdrawal Method</label>
              <select
                className='w-full rounded-md border px-3 py-2 text-base shadow-xs focus:outline-none focus:ring-2 focus:ring-[#08163d] transition'
                value={method}
                onChange={e => { setMethod(e.target.value); setDetails(''); setBank('') }}
              >
                <option value='Bank'>Bank</option>
                <option value='Mobile Money'>Mobile Money</option>
              </select>
            </div>
            {method === 'Bank' && (
              <div>
                <label className='block text-sm font-medium text-[#08163d] mb-1'>Select Bank</label>
                <select
                  className='w-full rounded-md border px-3 py-2 text-base shadow-xs focus:outline-none focus:ring-2 focus:ring-[#08163d] transition'
                  value={bank}
                  onChange={e => setBank(e.target.value)}
                  required
                >
                  {bankOptions.map(opt => (
                    <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className='block text-sm font-medium text-[#08163d] mb-1'>
                {method === 'Bank' ? 'Bank Account Number' : 'Phone Number'}
              </label>
              <Input
                type={method === 'Bank' ? 'text' : 'tel'}
                placeholder={method === 'Bank' ? 'Enter bank account number' : 'Enter phone number'}
                value={details}
                onChange={e => setDetails(e.target.value)}
                required
              />
            </div>
            <Button type='submit' className='mt-2 w-full flex items-center gap-2'>
              <ArrowDownCircle size={18} /> Request Withdrawal
            </Button>
          </form>
        </div>
        <div className='bg-white rounded-2xl shadow-md p-6'>
          <div className='font-semibold text-lg mb-4 text-[#08163d]'>Recent Withdrawal Requests</div>
          <table className='w-full text-left'>
            <thead>
              <tr className='text-gray-500 text-sm'>
                <th className='py-2'>ID</th>
                <th className='py-2'>Amount</th>
                <th className='py-2'>Date</th>
                <th className='py-2'>Time</th>
                <th className='py-2'>Method</th>
                <th className='py-2'>Details</th>
                <th className='py-2'>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentWithdrawals.map(row => (
                <tr key={row.id} className='border-t last:border-b-0'>
                  <td className='py-2'>{row.id}</td>
                  <td className='py-2'>UGX {row.amount.toLocaleString()}</td>
                  <td className='py-2'>{row.date}</td>
                  <td className='py-2'>{row.time}</td>
                  <td className='py-2 flex items-center gap-1'>
                    {row.method === 'Bank' ? <Banknote size={16} className='text-blue-400' /> : <Smartphone size={16} className='text-green-400' />} {row.method}
                  </td>
                  <td className='py-2'>{row.details}</td>
                  <td className='py-2'>
                    {row.status === 'Completed' && <span className='flex items-center gap-1 text-green-600'><CheckCircle size={16} /> Completed</span>}
                    {row.status === 'Pending' && <span className='flex items-center gap-1 text-yellow-600'><Clock size={16} /> Pending</span>}
                    {row.status === 'Failed' && <span className='flex items-center gap-1 text-red-600'><XCircle size={16} /> Failed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default WithdrawPage 