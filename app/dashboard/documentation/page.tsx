"use client"
import React, { useState } from 'react'
import { BookOpen, KeyRound, AlertTriangle, CheckCircle, Send, Search, FlaskConical, Zap } from 'lucide-react'

function DocumentationPage() {
  const [activeTab, setActiveTab] = useState<'live' | 'sandbox'>('live')

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <main className='flex-1 p-8 mx-auto w-full max-w-6xl'>
        <div className='flex items-center gap-3 mb-6'>
          <BookOpen className='text-[#08163d]' size={28} />
          <h1 className='font-bold text-2xl text-[#08163d]'>Gateway API Documentation</h1>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-xl shadow p-1 mb-6 flex gap-2'>
          <button
            onClick={() => setActiveTab('live')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'live'
                ? 'bg-[#08163d] text-white'
                : 'text-gray-600 hover:text-[#08163d] hover:bg-gray-50'
            }`}
          >
            <Zap className='w-4 h-4' />
            Live API
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'sandbox'
                ? 'bg-[#08163d] text-white'
                : 'text-gray-600 hover:text-[#08163d] hover:bg-gray-50'
            }`}
          >
            <FlaskConical className='w-4 h-4' />
            Sandbox
          </button>
        </div>

        {/* Live API Tab Content */}
        {activeTab === 'live' && (
          <>
            <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6'>
              <div className='flex items-start gap-2'>
                <AlertTriangle className='text-amber-600 mt-0.5' size={20} />
                <div>
                  <div className='font-semibold text-amber-900 mb-1'>Live API Access Required</div>
                  <div className='text-sm text-amber-800'>
                    The Live API endpoints process real money transactions. To access these endpoints, please contact us to get your API credentials approved.
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication Section */}
            <div className='bg-white rounded-xl shadow p-6 mb-6'>
              <div className='flex items-center gap-2 mb-3'>
                <KeyRound className='text-blue-500' size={20} />
                <span className='font-semibold text-[#08163d] text-lg'>Authentication</span>
              </div>
              <div className='text-sm text-gray-700 mb-3'>
                All API requests require authentication using your <b>API Key</b> in the <b>x-api-key</b> header.
              </div>
              <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`// Production
fetch('https://api.rukapay.net/api/v1/gateway/process-transfer', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ ... })
})

// Development
fetch('https://dev-api.rukapay.net/api/v1/gateway/process-transfer', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ ... })
})`}
              </pre>
            </div>

            {/* Base URL */}
            <div className='bg-white rounded-xl shadow p-6 mb-6'>
              <div className='font-semibold text-[#08163d] mb-3'>Base URL</div>
              <div className='space-y-3'>
                <div>
                  <div className='text-xs font-semibold text-gray-600 mb-1'>Production</div>
                  <div className='text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded'>
                    https://api.rukapay.net/api/v1/gateway
                  </div>
                </div>
                <div>
                  <div className='text-xs font-semibold text-gray-600 mb-1'>Development</div>
                  <div className='text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded'>
                    https://dev-api.rukapay.net/api/v1/gateway
                  </div>
                </div>
              </div>
              <div className='mt-4 text-xs text-gray-600'>
                <p className='mb-1'><b>Note:</b> Use the Production URL for live transactions. Use the Development URL for testing and sandbox environments.</p>
              </div>
            </div>
          </>
        )}

        {/* Sandbox Tab Content */}
        {activeTab === 'sandbox' && (
          <>
            <div className='bg-green-50 border border-green-200 rounded-xl p-4 mb-6'>
              <div className='flex items-start gap-2'>
                <FlaskConical className='text-green-600 mt-0.5' size={20} />
                <div>
                  <div className='font-semibold text-green-900 mb-1'>Sandbox Environment</div>
                  <div className='text-sm text-green-800'>
                    The Sandbox endpoints are available for everyone to test API integration without processing real money. No approval required - just use your API key to get started!
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication Section */}
            <div className='bg-white rounded-xl shadow p-6 mb-6'>
              <div className='flex items-center gap-2 mb-3'>
                <KeyRound className='text-blue-500' size={20} />
                <span className='font-semibold text-[#08163d] text-lg'>Authentication</span>
              </div>
              <div className='text-sm text-gray-700 mb-3'>
                All API requests require authentication using your <b>API Key</b> in the <b>x-api-key</b> header.
              </div>
              <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`// Production
fetch('https://api.rukapay.net/api/v1/gateway/process-transfer-sandbox', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ ... })
})

// Development (Recommended for testing)
fetch('https://dev-api.rukapay.net/api/v1/gateway/process-transfer-sandbox', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ ... })
})`}
              </pre>
            </div>

            {/* Base URL */}
            <div className='bg-white rounded-xl shadow p-6 mb-6'>
              <div className='font-semibold text-[#08163d] mb-3'>Base URL</div>
              <div className='space-y-3'>
                <div>
                  <div className='text-xs font-semibold text-gray-600 mb-1'>Production</div>
                  <div className='text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded'>
                    https://api.rukapay.net/api/v1/gateway
                  </div>
                </div>
                <div>
                  <div className='text-xs font-semibold text-gray-600 mb-1'>Development</div>
                  <div className='text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded'>
                    https://dev-api.rukapay.net/api/v1/gateway
                  </div>
                </div>
              </div>
              <div className='mt-4 text-xs text-gray-600'>
                <p className='mb-1'><b>Note:</b> Sandbox endpoints are available on both Production and Development URLs. Use Development URL for testing.</p>
              </div>
            </div>
          </>
        )}

        {/* Live API Endpoints */}
        {activeTab === 'live' && (
          <>
            {/* API Endpoint 1: Process Transfer */}
            <div className='bg-white rounded-xl shadow p-6 mb-6'>
          <div className='flex items-center gap-2 mb-4'>
            <Send className='text-green-500' size={20} />
            <span className='font-semibold text-[#08163d] text-lg'>1. Process Transfer</span>
          </div>
          <div className='mb-3'>
            <span className='font-mono text-sm bg-blue-100 px-2 py-1 rounded'>POST</span>
            <span className='ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded'>/api/v1/gateway/process-transfer</span>
          </div>
          <div className='text-sm text-gray-700 mb-4'>
            Send REAL money to Mobile Money (MTN/Airtel) or Bank accounts. This endpoint processes actual money transfers and deducts funds from your partner wallet.
          </div>

          <div className='mb-4'>
            <div className='font-semibold text-[#08163d] mb-2'>Request Body</div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "transactionMode": "PARTNER_SEND_MNO",  // or "PARTNER_SEND_BANK", "PARTNER_PAY_BILL_PAYMENT", "PARTNER_PAY_AIRTIME"
  "amount": 50000,
  "currency": "UGX",
  "walletType": "ESCROW",  // Optional: "ESCROW" or "COMMISSION"
  "narration": "Payment for services",
  "partnerReference": "PARTNER-REF-123456",
  "callbackUrl": "https://partner.com/webhook/callback",  // Optional
  
  // For MNO transfers (PARTNER_SEND_MNO):
  "phoneNumber": "256700000000",
  "mnoProvider": "MTN",  // or "AIRTEL"
  "recipientName": "John Doe",  // Optional
  
  // For Bank transfers (PARTNER_SEND_BANK):
  "accountNumber": "1234567890",
  "bankCode": "STANBIC",
  "accountName": "John Doe",

  // For Bill Payment (PARTNER_PAY_BILL_PAYMENT):
  "billerCode": "NWSC",  // alias accepted: biller_code
  "accountNumber": "123456789",  // alias accepted: account_number

  // For Airtime (PARTNER_PAY_AIRTIME):
  "phoneNumber": "256700000000",  // alias accepted: customer_phone
  "mnoProvider": "MTN",  // alias accepted: network
  
  // Optional metadata
  "metadata": {
    "customerId": "12345",
    "orderId": "ORD-789"
  }
}`}
            </pre>
          </div>

          <div className='mb-4'>
            <div className='font-semibold text-[#08163d] mb-2'>Success Response (200)</div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "success": true,
  "message": "Transfer processed successfully",
  "transaction": {
    "transactionId": "txn_abc123",
    "reference": "TXN_1764857915115",
    "amount": 50000,
    "fee": 1000,
    "totalCharged": 51000,
    "status": "SUCCESS",
    "recipient": {
      "name": "VERIFIED",
      "account": "256700000000",
      "provider": "MTN"
    },
    "createdAt": "2024-12-04T10:00:00Z"
  },
  "walletBalance": {
    "walletId": "wallet-id",
    "walletType": "ESCROW",
    "balanceBefore": 10000000,
    "balanceAfter": 9949000,
    "currency": "UGX"
  }
}`}
            </pre>
          </div>

          <div className='mb-4'>
            <div className='font-semibold text-[#08163d] mb-2'>Error Response (400)</div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "statusCode": 400,
  "message": "Insufficient balance. Required: 51000 UGX, Available: 10000 UGX",
  "error": "Bad Request"
}`}
            </pre>
          </div>

          <div className='bg-blue-50 border border-blue-200 rounded p-3 text-xs'>
            <div className='font-semibold text-blue-900 mb-1'>💡 Note:</div>
            <ul className='list-disc list-inside text-blue-800 space-y-1'>
              <li>Total amount deducted = Transfer Amount + Commission Fee</li>
              <li>Commission fee is calculated based on your partner tariff</li>
              <li>For MNO: Phone number must be in format 256XXXXXXXXX</li>
              <li>For BANK: Bank code can be bank name (e.g., "STANBIC") or sort code</li>
            </ul>
          </div>
        </div>

        {/* API Endpoint 2: Validate Beneficiary */}
        <div className='bg-white rounded-xl shadow p-6 mb-6'>
          <div className='flex items-center gap-2 mb-4'>
            <CheckCircle className='text-blue-500' size={20} />
            <span className='font-semibold text-[#08163d] text-lg'>2. Validate Beneficiary</span>
          </div>
          <div className='mb-3'>
            <span className='font-mono text-sm bg-blue-100 px-2 py-1 rounded'>POST</span>
            <span className='ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded'>/api/v1/gateway/validate-beneficiary</span>
          </div>
          <div className='text-sm text-gray-700 mb-4'>
            Validate a beneficiary account before initiating a money transfer, bill payment, or airtime purchase. Verify phone numbers for MNO/Airtime, bank accounts for bank transfers, or biller accounts for bill payments.
          </div>

          <div className='mb-4'>
            <div className='font-semibold text-[#08163d] mb-2'>Request Body</div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "transactionMode": "PARTNER_SEND_MNO",  // or "PARTNER_SEND_BANK", "PARTNER_PAY_BILL_PAYMENT", "PARTNER_PAY_AIRTIME"
  
  // For MNO validation (PARTNER_SEND_MNO):
  "phoneNumber": "256700000000",
  "mnoProvider": "MTN",  // or "AIRTEL"
  
  // For Bank validation (PARTNER_SEND_BANK):
  "accountNumber": "1234567890",
  "bankCode": "STANBIC",

  // For Bill Payment validation (PARTNER_PAY_BILL_PAYMENT):
  "billerCode": "NWSC",  // or "UMEME", "URA", "DSTV" (alias accepted: biller_code)
  "accountNumber": "123456789",

  // For Airtime validation (PARTNER_PAY_AIRTIME):
  "phoneNumber": "256700000000",  // (alias accepted: customer_phone)
  "network": "MTN",  // or "AIRTEL" (alias accepted: mnoProvider)
  
  "reference": "REF123456"  // Optional
}`}
            </pre>
          </div>

          <div className='mb-4'>
            <div className='font-semibold text-[#08163d] mb-2'>Success Response (200)</div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "success": true,
  "message": "Beneficiary validated successfully",
  "beneficiary": {
    "name": "JOHN DOE",
    "phoneNumber": "256700000000",
    "provider": "MTN",
    "isValid": true
  }
}

// OR for Bill Payment:
{
  "success": true,
  "message": "Beneficiary validated successfully",
  "beneficiary": {
    "name": "JOHN DOE",
    "billerCode": "NWSC",
    "accountNumber": "123456789",
    "provider": "National Water and Sewerage Corporation",
    "isValid": true
  }
}

// OR for Airtime:
{
  "success": true,
  "message": "Beneficiary validated successfully",
  "beneficiary": {
    "name": "JOHN DOE",
    "phoneNumber": "256700000000",
    "network": "MTN",
    "isValid": true
  }
}`}
            </pre>
          </div>

          <div className='mb-4'>
            <div className='font-semibold text-[#08163d] mb-2'>Error Response (400)</div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "success": false,
  "message": "Invalid phone number format",
  "error": "Phone number must be 256XXXXXXXXX"
}`}
            </pre>
          </div>

          <div className='bg-blue-50 border border-blue-200 rounded p-3 text-xs'>
            <div className='font-semibold text-blue-900 mb-1'>💡 Note:</div>
            <ul className='list-disc list-inside text-blue-800 space-y-1'>
              <li>Validation helps ensure the account exists before sending money</li>
              <li><b>For MNO (PARTNER_SEND_MNO):</b> Returns account holder name if available</li>
              <li><b>For BANK (PARTNER_SEND_BANK):</b> Validates account number and returns account holder name</li>
              <li><b>For Bill Payment (PARTNER_PAY_BILL_PAYMENT):</b> Validates biller code + account number (supported: NWSC, UMEME, URA, DSTV)</li>
              <li><b>For Airtime (PARTNER_PAY_AIRTIME):</b> Validates phone number is active (MTN/Airtel)</li>
              <li>Field aliases are supported (e.g., <code className='bg-blue-100 px-1 rounded'>biller_code</code> for <code className='bg-blue-100 px-1 rounded'>billerCode</code>)</li>
            </ul>
          </div>
        </div>

        {/* API Endpoint 3: Get Transaction Status */}
        <div className='bg-white rounded-xl shadow p-6 mb-6'>
          <div className='flex items-center gap-2 mb-4'>
            <Search className='text-purple-500' size={20} />
            <span className='font-semibold text-[#08163d] text-lg'>3. Get Transaction Status</span>
          </div>
          <div className='mb-3'>
            <span className='font-mono text-sm bg-green-100 px-2 py-1 rounded'>GET</span>
            <span className='ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded'>/api/v1/gateway/transactions/{'{transactionIdOrReference}'}/status</span>
          </div>
          <div className='text-sm text-gray-700 mb-4'>
            Retrieve the current status of a transaction by its system reference or partner reference.
          </div>

          <div className='mb-4'>
            <div className='font-semibold text-[#08163d] mb-2'>Search Order</div>
            <ol className='list-decimal list-inside text-sm text-gray-700 space-y-1 mb-3'>
              <li><b>System Reference</b> - e.g., <code className='bg-gray-100 px-1 rounded'>TXN_1764857915115</code></li>
              <li><b>Partner Reference</b> - e.g., <code className='bg-gray-100 px-1 rounded'>PARTNER-REF-123454</code></li>
              <li>Transaction ID (fallback for backward compatibility)</li>
            </ol>
            <div className='text-xs text-gray-600 italic'>
              If transaction is not found after checking all fields, a "Transaction not found" error is returned.
            </div>
          </div>

          <div className='mb-4'>
            <div className='font-semibold text-[#08163d] mb-2'>Example Request</div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`// Production - Using system reference
GET https://api.rukapay.net/api/v1/gateway/transactions/TXN_1764857915115/status
Headers: {
  "x-api-key": "YOUR_API_KEY"
}

// Development - Using partner reference
GET https://dev-api.rukapay.net/api/v1/gateway/transactions/PARTNER-REF-123454/status
Headers: {
  "x-api-key": "YOUR_API_KEY"
}`}
            </pre>
          </div>

          <div className='mb-4'>
            <div className='font-semibold text-[#08163d] mb-2'>Success Response (200)</div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "success": true,
  "message": "Transaction status retrieved successfully",
  "transaction": {
    "id": "txn_abc123",
    "partnerReference": "PARTNER-REF-123454",
    "amount": 50000,
    "fee": 1000,
    "totalAmount": 51000,
    "currency": "UGX",
    "status": "SUCCESS",
    "destinationType": "MNO",
    "destination": {
      "phoneNumber": "256700000000",
      "provider": "MTN"
    },
    "narration": "Payment for services",
    "createdAt": "2024-12-04T10:00:00Z",
    "completedAt": "2024-12-04T10:00:05Z"
  }
}`}
            </pre>
          </div>

          <div className='mb-4'>
            <div className='font-semibold text-[#08163d] mb-2'>Error Response (404)</div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "success": false,
  "message": "Transaction not found",
  "error": "TRANSACTION_NOT_FOUND"
}`}
            </pre>
          </div>

          <div className='bg-blue-50 border border-blue-200 rounded p-3 text-xs'>
            <div className='font-semibold text-blue-900 mb-1'>💡 Note:</div>
            <ul className='list-disc list-inside text-blue-800 space-y-1'>
              <li>You can use either the system-generated reference or your partner reference</li>
              <li>Partners can only query transactions they initiated (filtered by partnerId)</li>
              <li>Transaction status can be: PENDING, SUCCESS, FAILED, PROCESSING</li>
            </ul>
          </div>
        </div>

            {/* Transaction Modes */}
            <div className='bg-white rounded-xl shadow p-6 mb-6'>
              <div className='font-semibold text-[#08163d] mb-3'>Transaction Modes</div>
              <div className='text-sm text-gray-700 space-y-3'>
                <div>
                  <div className='font-semibold mb-1'>PARTNER_SEND_MNO</div>
                  <div className='text-xs text-gray-600'>
                    Send money to MTN or Airtel mobile money accounts. Requires <code className='bg-gray-100 px-1 rounded'>phoneNumber</code> and <code className='bg-gray-100 px-1 rounded'>mnoProvider</code>.
                  </div>
                </div>
                <div>
                  <div className='font-semibold mb-1'>PARTNER_SEND_BANK</div>
                  <div className='text-xs text-gray-600'>
                    Send money to bank accounts. Requires <code className='bg-gray-100 px-1 rounded'>accountNumber</code>, <code className='bg-gray-100 px-1 rounded'>bankCode</code>, and <code className='bg-gray-100 px-1 rounded'>accountName</code>.
                  </div>
                </div>
                <div>
                  <div className='font-semibold mb-1'>PARTNER_PAY_BILL_PAYMENT</div>
                  <div className='text-xs text-gray-600'>
                    Pay a utility/biller account. Requires <code className='bg-gray-100 px-1 rounded'>billerCode</code> and <code className='bg-gray-100 px-1 rounded'>accountNumber</code>.
                  </div>
                </div>
                <div>
                  <div className='font-semibold mb-1'>PARTNER_PAY_AIRTIME</div>
                  <div className='text-xs text-gray-600'>
                    Purchase airtime for a customer. Requires <code className='bg-gray-100 px-1 rounded'>phoneNumber</code> and <code className='bg-gray-100 px-1 rounded'>mnoProvider</code>.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Sandbox API Endpoints */}
        {activeTab === 'sandbox' && (
          <>
            {/* Sandbox Endpoint 1: Validate Beneficiary */}
            <div className='bg-white rounded-xl shadow p-6 mb-6'>
              <div className='flex items-center gap-2 mb-4'>
                <CheckCircle className='text-blue-500' size={20} />
                <span className='font-semibold text-[#08163d] text-lg'>1. Validate Beneficiary (Sandbox)</span>
              </div>
              <div className='mb-3'>
                <span className='font-mono text-sm bg-blue-100 px-2 py-1 rounded'>POST</span>
                <span className='ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded'>/api/v1/gateway/validate-beneficiary-sandbox</span>
              </div>
              <div className='text-sm text-gray-700 mb-4'>
                Validate a beneficiary account before initiating a money transfer. This sandbox endpoint simulates validation responses without calling real APIs. Perfect for testing your integration!
              </div>

              <div className='bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-xs'>
                <div className='font-semibold text-yellow-900 mb-1'>⚠️ Important:</div>
                <ul className='list-disc list-inside text-yellow-800 space-y-1'>
                  <li>Only works in development environment</li>
                  <li>Returns dummy validation responses</li>
                  <li>Does NOT call real validation APIs</li>
                  <li>Use example phone numbers and bank codes below for testing</li>
                </ul>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Request Body</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "transactionMode": "PARTNER_SEND_MNO",  // or "PARTNER_SEND_BANK", "PARTNER_PAY_BILL_PAYMENT", "PARTNER_PAY_AIRTIME"
  
  // For MNO validation:
  "phoneNumber": "256700123456",
  "mnoProvider": "MTN",  // or "AIRTEL"
  
  // For Bank validation:
  "accountNumber": "1234567890",
  "bankCode": "040147",  // or "STANBIC"

  // For Bill Payment validation:
  "billerCode": "NWSC",  // or "UMEME", "URA", "DSTV"
  "accountNumber": "123456789",

  // For Airtime validation:
  "phoneNumber": "256700123456",
  "network": "MTN",  // or "AIRTEL"
  
  "reference": "REF123456"  // Optional
}`}
                </pre>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Example Phone Numbers (MNO & Airtime)</div>
                <div className='text-xs text-gray-700 space-y-2 mb-3'>
                  <div><b>MTN (070 prefix):</b> <code className='bg-gray-100 px-1 rounded'>256700123456</code>, <code className='bg-gray-100 px-1 rounded'>256700000000</code> → Returns "John Doe"</div>
                  <div><b>MTN (071 prefix):</b> <code className='bg-gray-100 px-1 rounded'>256710123456</code>, <code className='bg-gray-100 px-1 rounded'>256710888888</code> → Returns "Jane Smith"</div>
                  <div><b>Airtel (074 prefix):</b> <code className='bg-gray-100 px-1 rounded'>256740123456</code>, <code className='bg-gray-100 px-1 rounded'>256740777777</code> → Returns "Jane Smith"</div>
                  <div><b>Airtel (075 prefix):</b> <code className='bg-gray-100 px-1 rounded'>256750123456</code>, <code className='bg-gray-100 px-1 rounded'>256750666666</code> → Returns "Peter Okello"</div>
                </div>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Example Bank Codes</div>
                <div className='text-xs text-gray-700 space-y-2 mb-3'>
                  <div><b>Stanbic (040147):</b> Account <code className='bg-gray-100 px-1 rounded'>1234567890</code> → Returns "John Doe"</div>
                  <div><b>DFCU (050147):</b> Account <code className='bg-gray-100 px-1 rounded'>9876543210</code> → Returns "Jane Smith"</div>
                  <div><b>Centenary (163747):</b> Account <code className='bg-gray-100 px-1 rounded'>1122334455</code> → Returns "Peter Okello"</div>
                  <div><b>Equity (300147):</b> Account <code className='bg-gray-100 px-1 rounded'>5566778899</code> → Returns "Mary Nakato"</div>
                  <div><b>Standard Chartered (080147):</b> Account <code className='bg-gray-100 px-1 rounded'>2233445566</code> → Returns "David Kato"</div>
                  <div><b>Diamond Trust (190147):</b> Account <code className='bg-gray-100 px-1 rounded'>3344556677</code> → Returns "Sarah Namukasa"</div>
                  <div><b>Housing Finance (230147):</b> Account <code className='bg-gray-100 px-1 rounded'>4455667788</code> → Returns "James Mukasa"</div>
                  <div><b>Ecobank (290147):</b> Account <code className='bg-gray-100 px-1 rounded'>6677889900</code> → Returns "Grace Nakibuuka"</div>
                  <div><b>UBA (260147):</b> Account <code className='bg-gray-100 px-1 rounded'>7788990011</code> → Returns "Robert Ssemwogerere"</div>
                  <div><b>Absa (013847):</b> Account <code className='bg-gray-100 px-1 rounded'>8899001122</code> → Returns "Patricia Nalubega"</div>
                </div>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Example Bill Payment Billers</div>
                <div className='text-xs text-gray-700 space-y-2 mb-3'>
                  <div><b>NWSC:</b> Account <code className='bg-gray-100 px-1 rounded'>123456789</code> → Returns "John Doe"</div>
                  <div><b>UMEME:</b> Account <code className='bg-gray-100 px-1 rounded'>1111222233</code> → Returns "Mary Nakato"</div>
                  <div><b>URA:</b> Account <code className='bg-gray-100 px-1 rounded'>2222333344</code> → Returns "James Mukasa"</div>
                  <div><b>DSTV:</b> Account <code className='bg-gray-100 px-1 rounded'>3333444455</code> → Returns "Robert Ssemwogerere"</div>
                </div>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Success Response (200)</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "success": true,
  "message": "Beneficiary validated successfully (SANDBOX)",
  "beneficiary": {
    "phoneNumber": "256700123456",
    "provider": "MTN",
    "name": "John Doe",
    "isValid": true
  }
}`}
                </pre>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Error Response (400)</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "success": false,
  "message": "Invalid phone number format",
  "error": "Phone number must be 256XXXXXXXXX"
}`}
                </pre>
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded p-3 text-xs'>
                <div className='font-semibold text-blue-900 mb-1'>💡 Note:</div>
                <ul className='list-disc list-inside text-blue-800 space-y-1'>
                  <li>Use the example phone numbers and bank codes above for testing</li>
                  <li>Validation helps ensure the account exists before sending money</li>
                  <li>For MNO: Returns account holder name if available</li>
                  <li>For BANK: Validates account number and returns account holder name</li>
                </ul>
              </div>
            </div>

            {/* Sandbox Endpoint 2: Process Transfer */}
            <div className='bg-white rounded-xl shadow p-6 mb-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Send className='text-green-500' size={20} />
                <span className='font-semibold text-[#08163d] text-lg'>2. Process Transfer (Sandbox)</span>
              </div>
              <div className='mb-3'>
                <span className='font-mono text-sm bg-blue-100 px-2 py-1 rounded'>POST</span>
                <span className='ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded'>/api/v1/gateway/process-transfer-sandbox</span>
              </div>
              <div className='text-sm text-gray-700 mb-4'>
                Simulate money transfers to Mobile Money (MTN/Airtel) or Bank accounts. This sandbox endpoint returns successful responses without processing real money. Perfect for testing your integration flow!
              </div>

              <div className='bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-xs'>
                <div className='font-semibold text-yellow-900 mb-1'>⚠️ Important:</div>
                <ul className='list-disc list-inside text-yellow-800 space-y-1'>
                  <li>Only works in development environment</li>
                  <li>Returns dummy successful response with same format as live API</li>
                  <li>Does NOT process real transactions</li>
                  <li>Does NOT deduct or add real money</li>
                  <li>For SEND transactions: <code className='bg-yellow-100 px-1 rounded'>recipientName</code> or <code className='bg-yellow-100 px-1 rounded'>accountName</code> is required</li>
                  <li>For COLLECT transactions: <code className='bg-yellow-100 px-1 rounded'>callbackUrl</code> is mandatory</li>
                </ul>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Supported Transaction Modes</div>
                <div className='text-sm text-gray-700 space-y-2 mb-3'>
                  <div><b>PARTNER_SEND_MNO:</b> Send to MTN/Airtel (simulated) - requires <code className='bg-gray-100 px-1 rounded'>recipientName</code> or <code className='bg-gray-100 px-1 rounded'>accountName</code></div>
                  <div><b>PARTNER_SEND_BANK:</b> Send to bank account (simulated) - requires <code className='bg-gray-100 px-1 rounded'>recipientName</code> or <code className='bg-gray-100 px-1 rounded'>accountName</code></div>
                  <div><b>PARTNER_COLLECT_MNO:</b> Collect from MTN/Airtel (simulated) - requires <code className='bg-gray-100 px-1 rounded'>callbackUrl</code></div>
                  <div><b>PARTNER_RECEIVE_MNO:</b> Receive from MTN/Airtel (simulated) - requires <code className='bg-gray-100 px-1 rounded'>callbackUrl</code></div>
                  <div><b>PARTNER_PAY_BILL_PAYMENT:</b> Bill payment (simulated) - requires <code className='bg-gray-100 px-1 rounded'>billerCode</code> and <code className='bg-gray-100 px-1 rounded'>accountNumber</code></div>
                  <div><b>PARTNER_PAY_AIRTIME:</b> Airtime purchase (simulated) - requires <code className='bg-gray-100 px-1 rounded'>phoneNumber</code> and <code className='bg-gray-100 px-1 rounded'>mnoProvider</code></div>
                </div>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Request Body (Send to MNO)</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "transactionMode": "PARTNER_SEND_MNO",
  "amount": 50000,
  "currency": "UGX",
  "phoneNumber": "256700123456",
  "mnoProvider": "MTN",
  "recipientName": "John Doe",  // Required for send transactions
  "narration": "Payment",
  "partnerReference": "PARTNER-REF-123456"
}`}
                </pre>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Request Body (Send to Bank)</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "transactionMode": "PARTNER_SEND_BANK",
  "amount": 50000,
  "currency": "UGX",
  "accountNumber": "1234567890",
  "bankCode": "040147",  // or "STANBIC"
  "accountName": "John Doe",  // Required for send transactions
  "narration": "Payment",
  "partnerReference": "PARTNER-REF-123456"
}`}
                </pre>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Request Body (Collect from MNO)</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "transactionMode": "PARTNER_COLLECT_MNO",
  "amount": 50000,
  "currency": "UGX",
  "phoneNumber": "256710123456",
  "mnoProvider": "MTN",
  "narration": "Payment collection",
  "partnerReference": "PARTNER-REF-123456",
  "callbackUrl": "https://partner.com/webhook"  // Required for collect transactions
}`}
                </pre>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Request Body (Bill Payment)</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "transactionMode": "PARTNER_PAY_BILL_PAYMENT",
  "amount": 50000,
  "currency": "UGX",
  "accountNumber": "123456789",  // alias accepted: account_number
  "billerCode": "NWSC",  // alias accepted: biller_code
  "narration": "Utility bill payment",
  "partnerReference": "PARTNER-REF-123458"
}`}
                </pre>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Request Body (Airtime Purchase)</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "transactionMode": "PARTNER_PAY_AIRTIME",
  "amount": 10000,
  "currency": "UGX",
  "phoneNumber": "256700123456",  // alias accepted: customer_phone
  "mnoProvider": "MTN",  // alias accepted: network
  "narration": "Airtime purchase",
  "partnerReference": "PARTNER-REF-123459"
}`}
                </pre>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Success Response (200) - Send Transaction</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "success": true,
  "message": "Transfer processed successfully (SANDBOX)",
  "transaction": {
    "transactionId": "SANDBOX_SEND_1234567890_abc123",
    "reference": "GW1699999999ABC",
    "amount": 50000,
    "fee": 1000,
    "totalCharged": 51000,
    "status": "SUCCESS",
    "recipient": {
      "name": "VERIFIED",
      "account": "256700123456",
      "provider": "MTN"
    },
    "createdAt": "2024-11-06T10:00:00Z"
  },
  "walletBalance": {
    "walletId": "wallet-uuid",
    "walletType": "PERSONAL",
    "balanceBefore": 1000000,
    "balanceAfter": 949000,
    "currency": "UGX"
  }
}`}
                </pre>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Success Response (200) - Collect Transaction</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "success": true,
  "message": "Collection processed successfully (SANDBOX)",
  "transaction": {
    "transactionId": "SANDBOX_COLLECT_1234567890_abc123",
    "reference": "GW1699999999ABC",
    "amount": 50000,
    "fee": 1000,
    "totalCharged": 51000,
    "status": "SUCCESS",
    "sender": {
      "name": "VERIFIED_USER",
      "phoneNumber": "256710123456",
      "provider": "MTN"
    },
    "createdAt": "2024-11-06T10:00:00Z"
  },
  "walletBalance": {
    "walletId": "wallet-uuid",
    "walletType": "PERSONAL",
    "balanceBefore": 1000000,
    "balanceAfter": 1050000,
    "currency": "UGX"
  }
}`}
                </pre>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Error Response (400)</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "statusCode": 400,
  "message": "Sandbox endpoint is only available in development environment",
  "error": "Bad Request"
}`}
                </pre>
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded p-3 text-xs'>
                <div className='font-semibold text-blue-900 mb-1'>💡 Note:</div>
                <ul className='list-disc list-inside text-blue-800 space-y-1'>
                  <li>Response format matches the live API for easy integration testing</li>
                  <li>Use example phone numbers and bank codes from the Validate Beneficiary endpoint</li>
                  <li>For send transactions, always include recipientName or accountName</li>
                  <li>For collect transactions, callbackUrl is mandatory</li>
                </ul>
              </div>
            </div>

            {/* Sandbox Endpoint 3: Get Transactions */}
            <div className='bg-white rounded-xl shadow p-6 mb-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Search className='text-purple-500' size={20} />
                <span className='font-semibold text-[#08163d] text-lg'>3. Get Transactions</span>
              </div>
              <div className='mb-3'>
                <span className='font-mono text-sm bg-green-100 px-2 py-1 rounded'>GET</span>
                <span className='ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded'>/api/v1/gateway/transactions</span>
              </div>
              <div className='text-sm text-gray-700 mb-4'>
                Retrieve a list of recent transactions for the authenticated partner. This endpoint is available in both Live and Sandbox environments.
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Example Request</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`// Production
GET https://api.rukapay.net/api/v1/gateway/transactions
Headers: {
  "x-api-key": "YOUR_API_KEY"
}

// Development
GET https://dev-api.rukapay.net/api/v1/gateway/transactions
Headers: {
  "x-api-key": "YOUR_API_KEY"
}

// Optional query parameters (coming soon)
GET https://api.rukapay.net/api/v1/gateway/transactions?page=1&limit=20
Headers: {
  "x-api-key": "YOUR_API_KEY"
}`}
                </pre>
              </div>

              <div className='mb-4'>
                <div className='font-semibold text-[#08163d] mb-2'>Success Response (200)</div>
                <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "success": true,
  "message": "Transactions retrieved successfully",
  "transactions": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0
  },
  "note": "Transaction history feature coming soon"
}`}
                </pre>
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded p-3 text-xs'>
                <div className='font-semibold text-blue-900 mb-1'>💡 Note:</div>
                <ul className='list-disc list-inside text-blue-800 space-y-1'>
                  <li>Currently returns empty array - transaction history feature coming soon</li>
                  <li>Partners can only query transactions they initiated (filtered by partnerId)</li>
                  <li>Pagination support will be added in future updates</li>
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Error Handling - Common for both tabs */}
        <div className='bg-white rounded-xl shadow p-6 mb-6'>
          <div className='flex items-center gap-2 mb-3'>
            <AlertTriangle className='text-yellow-500' size={20} />
            <span className='font-semibold text-[#08163d] text-lg'>Error Handling</span>
          </div>
          <div className='text-sm text-gray-700 mb-3'>
            All errors follow a consistent format. Always check the response status and error fields.
          </div>
          <div className='mb-3'>
            <div className='font-semibold text-[#08163d] mb-2'>Common HTTP Status Codes</div>
            <ul className='text-sm text-gray-700 space-y-1'>
              <li><b>200</b> - Success</li>
              <li><b>400</b> - Bad Request (invalid data, insufficient balance, etc.)</li>
              <li><b>401</b> - Unauthorized (invalid or missing API key)</li>
              <li><b>404</b> - Not Found (transaction not found)</li>
              <li><b>429</b> - Too Many Requests (rate limit exceeded)</li>
            </ul>
          </div>
          <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}`}
          </pre>
        </div>
      </main>
    </div>
  )
}

export default DocumentationPage
