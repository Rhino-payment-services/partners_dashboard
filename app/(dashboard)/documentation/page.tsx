"use client"
import React from 'react'
import NavaBar from '@/components/NavaBar'
import { Button } from '@/components/ui/button'
import { BookOpen, KeyRound, Code2, AlertTriangle } from 'lucide-react'

function DocumentationPage() {
  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <NavaBar />
      <main className='flex-1 p-8 mx-auto w-full max-w-3xl'>
        <div className='flex items-center gap-3 mb-6'>
          <BookOpen className='text-[#08163d]' size={28} />
          <h1 className='font-bold text-2xl text-[#08163d]'>API Documentation</h1>
        </div>
        <div className='bg-white rounded-xl shadow p-6 mb-8'>
          <div className='font-semibold text-[#08163d] mb-2'>Welcome to the RukaPay API</div>
          <div className='text-gray-700 text-sm mb-2'>
            The RukaPay API allows you to collect payments, manage transactions, and automate your business. Below you'll find the basics to get started. For full details, see the <a href='https://docs.rukapay.com' target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>full documentation</a>.
          </div>
        </div>
        <div className='bg-white rounded-xl shadow p-6 mb-8'>
          <div className='flex items-center gap-2 mb-2'>
            <KeyRound className='text-blue-500' size={18} />
            <span className='font-semibold text-[#08163d]'>Authentication</span>
          </div>
          <div className='text-xs text-gray-700 mb-2'>
            All API requests require authentication using your <b>public key</b> in the <b>Authorization</b> header as a Bearer token.
          </div>
          <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto mb-2'>
{`fetch('https://api.rukapay.com/v1/payments', {
  headers: {
    'Authorization': 'Bearer pk_live_ABCDEF1234567890'
  }
})`}
          </pre>
        </div>
        <div className='bg-white rounded-xl shadow p-6 mb-8'>
          <div className='flex items-center gap-2 mb-2'>
            <Code2 className='text-green-500' size={18} />
            <span className='font-semibold text-[#08163d]'>Example: Create a Payment</span>
          </div>
          <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto mb-2'>
{`fetch('https://api.rukapay.com/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pk_live_ABCDEF1234567890',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 1000,
    currency: 'UGX',
    customer: 'john@example.com'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));`}
          </pre>
        </div>
        <div className='bg-white rounded-xl shadow p-6 mb-8'>
          <div className='flex items-center gap-2 mb-2'>
            <AlertTriangle className='text-yellow-500' size={18} />
            <span className='font-semibold text-[#08163d]'>Error Handling</span>
          </div>
          <div className='text-xs text-gray-700 mb-2'>
            If a request fails, the API will return a JSON response with an <b>error</b> field. Always check for errors in your integration.
          </div>
          <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto mb-2'>
{`{
  "error": {
    "type": "invalid_request",
    "message": "The amount is required."
  }
}`}
          </pre>
        </div>
        <div className='flex justify-end'>
          <a href='https://docs.rukapay.com' target='_blank' rel='noopener noreferrer'>
            <Button variant='outline' className='flex items-center gap-2'>
              <BookOpen size={16} /> Full API Docs
            </Button>
          </a>
        </div>
      </main>
    </div>
  )
}

export default DocumentationPage 