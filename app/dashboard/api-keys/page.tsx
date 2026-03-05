"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertTriangle, KeyRound, Copy } from 'lucide-react'
import { getPartnerProfile, generateGatewayApiKey, revokeGatewayApiKey } from '@/lib/api'
import { usePartnerPermissions } from '@/hooks/use-partner-permissions'

const ENV_VAR = 'development'
const CURRENT_ENV: 'DEVELOPMENT' | 'PRODUCTION' = ENV_VAR.toLowerCase() === 'development' ? 'DEVELOPMENT' : 'PRODUCTION'
const ENV_LABEL = CURRENT_ENV === 'DEVELOPMENT' ? 'Development' : 'Production'

interface ApiKey {
  id: string
  keyPrefix: string
  description: string | null
  environment: string | null
  expiresAt: string | null
  lastUsedAt: string | null
  createdAt: string
}

export default function ApiKeysPage() {
  const { canManageApiKeys, loading: permissionsLoading } = usePartnerPermissions()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState<'public' | 'secret' | ''>('')
  const [showRevokeModal, setShowRevokeModal] = useState(false)
  const [revokeInput, setRevokeInput] = useState('')
  const [revokeError, setRevokeError] = useState<string | null>(null)

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const profile = await getPartnerProfile()
      setPartnerId(profile.partner?.id || null)
      // Backend returns apiKeys at the top level of the profile object
      const allKeys: ApiKey[] = profile.apiKeys || []
      const envKeys = allKeys.filter((k) => (k.environment || 'PRODUCTION') === CURRENT_ENV)
      setKeys(envKeys)
    } catch (e: any) {
      console.error('Failed to load partner profile', e)
      setError(e.message || 'Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleGenerate = async () => {
    if (!partnerId) {
      setError('Partner not found for this user')
      return
    }
    try {
      setGenerating(true)
      setError(null)
      const res = await generateGatewayApiKey(partnerId, CURRENT_ENV)
      const apiKey = res?.data?.apiKey as string | undefined
      if (apiKey) {
        setGeneratedKey(apiKey)
      }
      await loadProfile()
    } catch (e: any) {
      console.error('Failed to generate API key', e)
      setError(e.message || 'Failed to generate API key')
    } finally {
      setGenerating(false)
    }
  }

  const handleRevoke = async (keyId: string) => {
    // Require exact phrase to avoid mistakes
    if (revokeInput.trim().toLowerCase() !== 'revoke my api key') {
      setRevokeError('Please type "revoke my api key" to confirm.')
      return
    }
    try {
      setRevoking(keyId)
      setError(null)
      setRevokeError(null)
      await revokeGatewayApiKey(keyId, 'Revoked from partner dashboard')
      await loadProfile()
      setShowRevokeModal(false)
      setRevokeInput('')
    } catch (e: any) {
      console.error('Failed to revoke API key', e)
      setError(e.message || 'Failed to revoke API key')
    } finally {
      setRevoking(null)
    }
  }

  const handleCopy = (value: string, which: 'public' | 'secret') => {
    navigator.clipboard.writeText(value)
    setCopied(which)
    setTimeout(() => setCopied(''), 1500)
  }

  const hasActiveKey = keys.length > 0
  const currentKey = keys[0] || null

  const publicDisplay = currentKey ? `ak_${currentKey.keyPrefix}********` : 'No active key yet'

  // Check permissions
  if (permissionsLoading) {
    return (
      <div className='flex flex-col min-h-screen bg-gray-50'>
        <main className='flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-5xl'>
          <div className='text-center py-8 text-gray-500'>Loading...</div>
        </main>
      </div>
    )
  }

  if (!canManageApiKeys) {
    return (
      <div className='flex flex-col min-h-screen bg-gray-50'>
        <main className='flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-5xl'>
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center'>
            <AlertTriangle className='mx-auto mb-4 text-red-600' size={48} />
            <h2 className='text-2xl font-bold text-red-800 dark:text-red-200 mb-2'>Access Denied</h2>
            <p className='text-red-600 dark:text-red-300'>
              You don't have permission to manage API keys. Please contact your administrator.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <main className='flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-5xl'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <KeyRound className='text-[#08163d]' size={28} />
            <div>
              <h1 className='font-bold text-2xl text-[#08163d]'>API Keys</h1>
              <p className='text-xs text-gray-500 mt-1'>Environment: <span className='font-semibold'>{ENV_LABEL}</span></p>
            </div>
          </div>
        </div>

        {error && (
          <div className='mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded p-3'>
            {error}
          </div>
        )}

        {/* Key Management */}
        <div className='bg-white rounded-xl shadow p-6 mb-6 relative'>
          <div className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium text-[#08163d] mb-1'>Current {ENV_LABEL} API Key (public)</label>
              <div className='flex gap-2 items-center'>
                <Input readOnly value={publicDisplay} className='font-mono text-xs' />
                {currentKey && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => handleCopy(publicDisplay, 'public')}
                  >
                    <Copy size={16} />
                  </Button>
                )}
                {copied === 'public' && <span className='text-green-600 text-xs ml-2'>Copied!</span>}
              </div>
              {currentKey && (
                <p className='text-[11px] text-gray-500 mt-1'>
                  Key prefix: <span className='font-mono'>{currentKey.keyPrefix}</span>
                  {currentKey.expiresAt && (
                    <> · Expires: {new Date(currentKey.expiresAt).toLocaleString()}</>
                  )}
                </p>
              )}
            </div>

            {generatedKey && (
              <div className='mt-2 border rounded-lg border-yellow-300 bg-yellow-50 p-3 text-xs'>
                <div className='flex items-center gap-2 mb-1'>
                  <AlertTriangle className='text-yellow-600' size={16} />
                  <span className='font-semibold text-yellow-800'>New API key generated (shown once)</span>
                </div>
                <div className='flex gap-2 items-center mt-1'>
                  <Input
                    readOnly
                    value={generatedKey}
                    className='font-mono text-xs'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => handleCopy(generatedKey, 'secret')}
                  >
                    <Copy size={16} />
                  </Button>
                  {copied === 'secret' && <span className='text-green-600 text-xs ml-2'>Copied!</span>}
                </div>
                <p className='text-[11px] text-yellow-800 mt-1'>
                  Store this key securely. You will not be able to see it again after leaving this page.
                </p>
              </div>
            )}

            <div className='flex items-center justify-between mt-2'>
              <div className='text-[11px] text-gray-500 max-w-md'>
                You can have <b>only one active {ENV_LABEL.toLowerCase()} API key</b>. To generate a new one, revoke the existing key first.
              </div>
              <div className='flex gap-2'>
                {currentKey && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={!!revoking}
                    onClick={() => {
                      setShowRevokeModal(true)
                      setRevokeInput('')
                      setRevokeError(null)
                    }}
                  >
                    Revoke Key
                  </Button>
                )}
                <Button
                  type='button'
                  size='sm'
                  onClick={handleGenerate}
                  disabled={generating || hasActiveKey}
                >
                  {generating ? 'Generating...' : hasActiveKey ? 'Key Active' : 'Generate API Key'}
                </Button>
              </div>
            </div>
          </div>

          {/* Revoke confirmation modal */}
          {showRevokeModal && currentKey && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h2 className="font-semibold text-[#08163d] mb-2">Revoke API Key</h2>
                <p className="text-xs text-gray-600 mb-3">
                  This will permanently revoke your current {ENV_LABEL.toLowerCase()} API key
                  ({currentKey.keyPrefix}). You will not be able to use it again.
                </p>
                <p className="text-xs text-gray-700 mb-2">
                  To confirm, type <span className="font-mono bg-gray-100 px-1 rounded">revoke my api key</span> below:
                </p>
                <Input
                  value={revokeInput}
                  onChange={(e) => {
                    setRevokeInput(e.target.value)
                    setRevokeError(null)
                  }}
                  className="text-xs mb-2"
                  placeholder="revoke my api key"
                />
                {revokeError && (
                  <div className="text-[11px] text-red-600 mb-2">{revokeError}</div>
                )}
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowRevokeModal(false)
                      setRevokeInput('')
                      setRevokeError(null)
                    }}
                    disabled={!!revoking}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRevoke(currentKey.id)}
                    disabled={!!revoking}
                  >
                    {revoking === currentKey.id ? 'Revoking...' : 'Confirm Revoke'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* How to use the key with backend structure */}
        <div className='bg-white rounded-xl shadow p-6 mb-6'>
          <div className='font-semibold text-[#08163d] mb-2'>How it works</div>
          <ul className='text-xs text-gray-700 list-disc pl-4 space-y-1 mb-3'>
            <li>Your API key is linked to this partner and the <b>{ENV_LABEL.toLowerCase()}</b> environment.</li>
            <li>Only <b>one active key per environment</b> is allowed. Backend will reject duplicates.</li>
            <li>Use this key in the <code className='bg-gray-100 px-1 rounded'>x-api-key</code> header when calling partner APIs.</li>
          </ul>
          <div className='mb-2 text-xs text-gray-600'>Example request:</div>
          <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto mb-2'>
{`fetch('https://api.rukapay.com/api/v1/subscriber/validate-user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY_HERE'
  },
  body: JSON.stringify({
    phoneNumber: '2567XXXXXXXX',
    channel: 'API'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));`}
          </pre>
          <p className='text-[11px] text-gray-500'>Replace <code>YOUR_API_KEY_HERE</code> with the value shown when you generate a new key.</p>
        </div>

        {/* Security tips */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-xl shadow p-6 mb-8 flex items-start gap-3'>
          <AlertTriangle className='text-yellow-500 mt-1' size={20} />
          <div>
            <div className='font-semibold text-yellow-700 mb-1'>Security tips</div>
            <ul className='text-xs text-yellow-800 list-disc pl-4 space-y-1'>
              <li>Never expose your API key in public frontend code.</li>
              <li>Store keys in environment variables on your backend.</li>
              <li>Rotate (revoke & generate) keys if you suspect compromise.</li>
              <li>Use separate keys for development and production environments.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
