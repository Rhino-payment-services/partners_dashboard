"use client"
import React from 'react'

export default function BankDoc() {
  return (
    <div className='bg-white rounded-xl shadow p-6 mb-8'>
      <h2 className='font-bold text-xl text-[#08163d] mb-2'>Collection from Bank</h2>
      <p className='text-gray-700 text-sm mb-4'>
        Use this endpoint to collect payments from a customer's bank account.
      </p>
      <div className='mb-2'>
        <span className='font-semibold text-[#08163d]'>Endpoint:</span>
        <span className='ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded'>POST /v1/collections/bank</span>
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
  "bank_account": "1234567890",
  "bank_code": "STANBIC",
  "reference": "INV-1003"
}`}
        </pre>
      </div>
      <div className='mb-2'>
        <span className='font-semibold text-[#08163d]'>Example Request:</span>
        <pre className='bg-gray-100 rounded p-2 text-xs font-mono overflow-x-auto mb-0'>
{`fetch('https://api.rukapay.com/v1/collections/bank', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pk_live_ABCDEF1234567890',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 10000,
    currency: 'UGX',
    bank_account: '1234567890',
    bank_code: 'STANBIC',
    reference: 'INV-1003'
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
    "transaction_id": "TXN1234567892",
    "amount": 10000,
    "currency": "UGX",
    "bank_account": "1234567890",
    "bank_code": "STANBIC",
    "reference": "INV-1003",
    "status": "pending"
  }
}`}
        </pre>
      </div>
      <div className='mb-2'>
        <span className='font-semibold text-[#08163d]'>Error Handling:</span>
        <table className='w-full text-xs bg-gray-50 rounded mt-2'>
          <thead>
            <tr className='text-gray-600'>
              <th className='py-1 px-2 text-left'>Status Code</th>
              <th className='py-1 px-2 text-left'>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='py-1 px-2'>200</td>
              <td className='py-1 px-2'>Request successful</td>
            </tr>
            <tr>
              <td className='py-1 px-2'>400</td>
              <td className='py-1 px-2'>Bad request (missing or invalid parameters)</td>
            </tr>
            <tr>
              <td className='py-1 px-2'>401</td>
              <td className='py-1 px-2'>Unauthorized (invalid or missing API key)</td>
            </tr>
            <tr>
              <td className='py-1 px-2'>404</td>
              <td className='py-1 px-2'>Resource not found</td>
            </tr>
            <tr>
              <td className='py-1 px-2'>500</td>
              <td className='py-1 px-2'>Internal server error</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
} 