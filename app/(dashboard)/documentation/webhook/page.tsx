"use client"
import React from 'react'

export default function WebhookDoc() {
  return (
    <div className='bg-white rounded-xl shadow p-6 mb-8'>
      <h2 className='font-bold text-xl text-[#08163d] mb-2'>How to Create Webhook</h2>
      <p className='text-gray-700 text-sm mb-4'>
        Use this endpoint to register a webhook URL to receive event notifications from RukaPay.
      </p>
      <div className='mb-2'>
        <span className='font-semibold text-[#08163d]'>Endpoint:</span>
        <span className='ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded'>POST /v1/webhooks</span>
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
  "url": "https://yourdomain.com/webhook",
  "events": ["payment.completed", "payment.failed"]
}`}
        </pre>
      </div>
      <div className='mb-2'>
        <span className='font-semibold text-[#08163d]'>Example Request:</span>
        <pre className='bg-gray-100 rounded p-2 text-xs font-mono overflow-x-auto mb-0'>
{`fetch('https://api.rukapay.com/v1/webhooks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pk_live_ABCDEF1234567890',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://yourdomain.com/webhook',
    events: ['payment.completed', 'payment.failed']
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
    "webhook_id": "WHK1234567890",
    "url": "https://yourdomain.com/webhook",
    "events": ["payment.completed", "payment.failed"],
    "status": "active"
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