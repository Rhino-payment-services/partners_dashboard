"use client"
import React from 'react'

export default function MobileMoneyDoc() {
  return (
    <div className='bg-white rounded-xl shadow p-6 mb-8'>
      <h2 className='font-bold text-xl text-[#08163d] mb-2'>Collection from Mobile Money</h2>
      <p className='text-gray-700 text-sm mb-4'>
        Use this endpoint to collect payments from a customer's Mobile Money account.
      </p>
      <div className='mb-2'>
        <span className='font-semibold text-[#08163d]'>Endpoint:</span>
        <span className='ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded'>POST /v1/collections/mobile-money</span>
      </div>
      <div className='mb-2'>
        <span className='font-semibold text-[#08163d]'>Method:</span>
        <span className='ml-2 text-xs'>POST</span>
      </div>
      <div className='mb-2'>
        <span className='font-semibold text-[#08163d]'>Headers:</span>
        <pre className='bg-gray-100 rounded p-2 text-xs font-mono overflow-x-auto mb-0'>
{`Authorization: Bearer YOUR_PUBLIC_KEY
Content-Type: application/json`}
        </pre>
      </div>
      <div className='mb-2'>
        <span className='font-semibold text-[#08163d]'>Request Body:</span>
        <pre className='bg-gray-100 rounded p-2 text-xs font-mono overflow-x-auto mb-0'>
{`{
  "amount": 10000,
  "currency": "UGX",
  "phone": "+256700123456",
  "reference": "INV-1001"
}`}
        </pre>
      </div>
      <div className='mb-2'>
        <span className='font-semibold text-[#08163d]'>Example Request:</span>
        <pre className='bg-gray-100 rounded p-2 text-xs font-mono overflow-x-auto mb-0'>
{`fetch('https://api.rukapay.com/v1/collections/mobile-money', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pk_live_ABCDEF1234567890',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 10000,
    currency: 'UGX',
    phone: '+256700123456',
    reference: 'INV-1001'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));`}
        </pre>
      </div>
      <div className='mb-2'>
        <span className='font-semibold text-[#08163d]'>Example Response:</span>
        <pre className='bg-gray-100 rounded p-2 text-xs font-mono overflow-x-auto mb-0'>
{`{
  "status": "success",
  "data": {
    "transaction_id": "TXN1234567890",
    "amount": 10000,
    "currency": "UGX",
    "phone": "+256700123456",
    "reference": "INV-1001",
    "status": "pending"
  }
}`}
        </pre>
      </div>
    </div>
  )
} 