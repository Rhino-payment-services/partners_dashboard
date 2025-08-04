"use client"
import React, { useState } from 'react'
import NavaBar from '@/components/NavaBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { AlertTriangle, KeyRound, Eye, EyeOff, Copy } from 'lucide-react'

function generateKeyPair() {
  // Placeholder: generate random keys
  const pub = 'pk_live_' + Math.random().toString(36).slice(2, 18).toUpperCase()
  const priv = 'sk_live_' + Math.random().toString(36).slice(2, 32).toUpperCase()
  return { publicKey: pub, privateKey: priv }
}

const apiUsageData = [
  { day: 'Mon', calls: 120 },
  { day: 'Tue', calls: 98 },
  { day: 'Wed', calls: 150 },
  { day: 'Thu', calls: 80 },
  { day: 'Fri', calls: 200 },
  { day: 'Sat', calls: 60 },
  { day: 'Sun', calls: 110 },
]

const apiKeyHistory = [
  { key: 'pk_live_OLDKEY123456', created: '2024-05-01', status: 'Active' },
  { key: 'pk_live_REVOKED7890', created: '2024-04-10', status: 'Revoked' },
]

function ApiKeysPage() {
  const [publicKey, setPublicKey] = useState('pk_live_ABCDEF1234567890')
  const [privateKey, setPrivateKey] = useState('')
  const [showPrivate, setShowPrivate] = useState(false)
  const [copied, setCopied] = useState('')
  const [showWarning, setShowWarning] = useState(false)

  const handleGenerate = () => {
    const { publicKey, privateKey } = generateKeyPair()
    setPublicKey(publicKey)
    setPrivateKey(privateKey)
    setShowPrivate(true)
    setShowWarning(true)
    setCopied('')
  }

  const handleCopy = (value: string, which: string) => {
    navigator.clipboard.writeText(value)
    setCopied(which)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <NavaBar />
      <main className='flex-1 p-8 mx-auto w-full max-w-6xl'>
        <div className='flex items-center gap-3 mb-6'>
          <KeyRound className='text-[#08163d]' size={28} />
          <h1 className='font-bold text-2xl text-[#08163d]'>API Keys</h1>
        </div>
        {/* Key Management Section (moved to top) */}
        <div className='bg-white rounded-xl shadow p-6 mb-8'>
          <div className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium text-[#08163d] mb-1'>Public Key</label>
              <div className='flex gap-2 items-center'>
                <Input readOnly value={publicKey} className='font-mono text-xs' />
                <Button type='button' variant='outline' size='icon' onClick={() => handleCopy(publicKey, 'public')}>
                  <Copy size={18} />
                </Button>
                {copied === 'public' && <span className='text-green-600 text-xs ml-2'>Copied!</span>}
              </div>
            </div>
            <div>
              <Button type='button' onClick={handleGenerate} className='flex items-center gap-2'>
                <KeyRound size={18} /> Generate New Key Pair
              </Button>
            </div>
            {showPrivate && (
              <div className='mt-4'>
                <label className='block text-sm font-medium text-[#08163d] mb-1'>Private Key</label>
                <div className='flex gap-2 items-center'>
                  <Input readOnly value={privateKey} className='font-mono text-xs' type='text' />
                  <Button type='button' variant='outline' size='icon' onClick={() => handleCopy(privateKey, 'private')}>
                    <Copy size={18} />
                  </Button>
                  {copied === 'private' && <span className='text-green-600 text-xs ml-2'>Copied!</span>}
                </div>
                {showWarning && (
                  <div className='flex items-center gap-2 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2'>
                    <AlertTriangle className='text-yellow-500' size={18} />
                    <span className='text-yellow-700 text-xs'>This private key will only be shown once. Please copy and store it securely.</span>
                  </div>
                )}
                <div className='mt-2'>
                  <Button type='button' variant='destructive' size='sm' onClick={() => { setShowPrivate(false); setShowWarning(false); setPrivateKey('') }}>
                    I have copied my private key
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* API Usage Examples */}
        <div className='bg-white rounded-xl shadow p-6 mb-8'>
          <div className='font-semibold text-[#08163d] mb-2'>How to Use Your API Keys</div>
          <div className='mb-4'>
            <div className='font-medium text-sm mb-1'>Send your <span className='text-blue-700'>public key</span> in API requests:</div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto mb-2'>
{`fetch('https://api.rukapay.com/v1/payments', {
  headers: {
    'Authorization': 'Bearer ${publicKey}'
  }
})
.then(res => res.json())
.then(data => console.log(data))`}
            </pre>
            <span className='text-xs text-gray-500'>The public key is sent in the <b>Authorization</b> header as a Bearer token.</span>
          </div>
          <div className='mb-2'>
            <div className='font-medium text-sm mb-1'>How to use your <span className='text-yellow-700'>private key</span>:</div>
            <div className='bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800 mb-2'>
              <b>Never send your private key over the network or include it in client-side code.</b> <br />
              The private key is used for server-to-server authentication, signing webhooks, or secure backend operations only.
            </div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto mb-2'>
{`// Example: Using your private key to sign a webhook (Node.js)
const crypto = require('crypto');
const signature = crypto.createHmac('sha256', 'YOUR_PRIVATE_KEY')
  .update(payload)
  .digest('hex');`}
            </pre>
            <span className='text-xs text-gray-500'>Keep your private key secret and secure. Use it only on your backend server.</span>
          </div>
        </div>
        {/* How to Use Signature Section */}
        <div className='bg-white rounded-xl shadow p-6 mb-8'>
          <div className='font-semibold text-[#08163d] mb-2'>How to Send a Signature with Your API Request</div>
          <div className='mb-2 text-sm text-gray-700'>
            For secure API operations, you may be required to sign your request using your <span className='font-semibold text-yellow-700'>private key</span>. The signature proves the authenticity and integrity of your request.
          </div>
          <div className='mb-2 text-xs text-gray-600'>
            <b>Step 1:</b> Generate a signature on your backend using your private key and the request payload (or specific fields).
          </div>
          <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto mb-2'>
{`// Node.js example
const crypto = require('crypto');

const payload = JSON.stringify({ amount: 1000, currency: 'UGX' });
const privateKey = 'YOUR_PRIVATE_KEY';

const signature = crypto
  .createHmac('sha256', privateKey)
  .update(payload)
  .digest('hex');`}
          </pre>
          <div className='mb-2 text-xs text-gray-600'>
            <b>Step 2:</b> Send the signature in your API request headers, along with your public key.
          </div>
          <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto mb-2'>
{`fetch('https://api.rukapay.com/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_PUBLIC_KEY',
    'X-Signature': signature,
    'Content-Type': 'application/json'
  },
  body: payload
})
  .then(res => res.json())
  .then(data => console.log(data));`}
          </pre>
          <div className='text-xs text-gray-500'>
            <b>Note:</b> Never send your private key in the request. Only send the signature generated with it. The server will verify the signature to ensure the request is authentic.
          </div>
        </div>
        {/* Quick Start Code Snippet */}
        <div className='bg-white rounded-xl shadow p-6 mb-8'>
          <div className='font-semibold text-[#08163d] mb-2'>Quick Start</div>
          <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto mb-2'>
{`fetch('https://api.rukapay.com/v1/payments', {
  headers: {
    'Authorization': 'Bearer ${publicKey}'
  }
})
.then(res => res.json())
.then(data => console.log(data))`}
          </pre>
          <a href='https://docs.rukapay.com' target='_blank' rel='noopener noreferrer' className='text-blue-600 text-xs underline'>View full API documentation</a>
        </div>
        {/* Security Tips */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-xl shadow p-6 mb-8 flex items-start gap-3'>
          <AlertTriangle className='text-yellow-500 mt-1' size={22} />
          <div>
            <div className='font-semibold text-yellow-700 mb-1'>Security Tips</div>
            <ul className='text-xs text-yellow-800 list-disc pl-4'>
              <li>Never share your private key with anyone.</li>
              <li>Store your private key in a secure password manager.</li>
              <li>Regenerate your keys if you suspect compromise.</li>
              <li>Use environment variables to store keys in your codebase.</li>
            </ul>
          </div>
        </div>
        {/* API Key History */}
        <div className='bg-white rounded-xl shadow p-6 mb-8'>
          <div className='font-semibold text-[#08163d] mb-2'>API Key History</div>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='text-gray-500'>
                <th className='py-2'>Public Key</th>
                <th className='py-2'>Created</th>
                <th className='py-2'>Status</th>
              </tr>
            </thead>
            <tbody>
              {apiKeyHistory.map(row => (
                <tr key={row.key} className='border-t last:border-b-0'>
                  <td className='py-2 font-mono'>{row.key}</td>
                  <td className='py-2'>{row.created}</td>
                  <td className={`py-2 ${row.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default ApiKeysPage 