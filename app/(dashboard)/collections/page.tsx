"use client"
import React, { useState } from 'react'
import NavaBar from '@/components/NavaBar'
import { TrendingUp, Filter, CheckCircle, Clock, XCircle, CreditCard } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const collectionsData = [
  { id: 'TXN001', payer: 'John Doe', amount: 500000, date: '2024-06-01', time: '09:15 AM', status: 'Completed', method: 'Card', details: '**** 1234' },
  { id: 'TXN002', payer: 'Jane Smith', amount: 1200000, date: '2024-05-30', time: '02:22 PM', status: 'Pending', method: 'Mobile Money', details: '+256 700 123456' },
  { id: 'TXN003', payer: 'Acme Corp', amount: 250000, date: '2024-05-28', time: '11:05 AM', status: 'Completed', method: 'Bank Transfer', details: '1234567890' },
  { id: 'TXN004', payer: 'Mary Johnson', amount: 800000, date: '2024-05-25', time: '04:40 PM', status: 'Failed', method: 'Card', details: '**** 5678' },
  { id: 'TXNL005', payer: 'Global Ltd', amount: 300000, date: '2024-05-22', time: '08:55 AM', status: 'Completed', method: 'Card', details: '**** 4321' },
]

function CollectionsPage() {
  const [search, setSearch] = useState('')
  const filteredData = collectionsData.filter(row =>
    row.payer.toLowerCase().includes(search.toLowerCase()) ||
    row.id.toLowerCase().includes(search.toLowerCase())
  )
  const totalCollected = collectionsData.filter(row => row.status === 'Completed').reduce((sum, row) => sum + row.amount, 0)

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <NavaBar />
      <main className='flex-1 p-8 mx-auto w-full '>
        <div className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <TrendingUp className='text-blue-500' size={32} />
            <div>
              <div className='text-gray-500 text-xs'>Total Collected</div>
              <div className='font-bold text-2xl text-[#08163d]'>UGX {totalCollected.toLocaleString()}</div>
            </div>
          </div>
          <div className='flex gap-2'>
            <Input
              className='w-56'
              placeholder='Search by payer or ID...'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button variant='outline' className='flex items-center gap-2'>
              <Filter size={16} /> Filters
            </Button>
          </div>
        </div>
        <div className='bg-white rounded-2xl shadow-md p-6'>
          <div className='font-semibold text-lg mb-4 text-[#08163d]'>Collections</div>
          <table className='w-full text-left'>
            <thead>
              <tr className='text-gray-500 text-sm'>
                <th className='py-2'>TXN ID</th>
                <th className='py-2'>Payer</th>
                <th className='py-2'>Amount</th>
                <th className='py-2'>Date</th>
                <th className='py-2'>Time</th>
                <th className='py-2'>Status</th>
                <th className='py-2'>Method</th>
                <th className='py-2'>Payment Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(row => (
                <tr key={row.id} className='border-t last:border-b-0'>
                  <td className='py-2'>{row.id}</td>
                  <td className='py-2'>{row.payer}</td>
                  <td className='py-2'>UGX {row.amount.toLocaleString()}</td>
                  <td className='py-2'>{row.date}</td>
                  <td className='py-2'>{row.time}</td>
                  <td className='py-2'>
                    {row.status === 'Completed' && <span className='flex items-center gap-1 text-green-600'><CheckCircle size={16} /> Completed</span>}
                    {row.status === 'Pending' && <span className='flex items-center gap-1 text-yellow-600'><Clock size={16} /> Pending</span>}
                    {row.status === 'Failed' && <span className='flex items-center gap-1 text-red-600'><XCircle size={16} /> Failed</span>}
                  </td>
                  <td className='py-2 flex items-center gap-1'>
                    <CreditCard size={16} className='text-blue-400' /> {row.method}
                  </td>
                  <td className='py-2'>{row.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default CollectionsPage 