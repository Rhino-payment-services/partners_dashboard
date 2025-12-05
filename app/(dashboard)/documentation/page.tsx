"use client"
import React from 'react'
import { BookOpen, KeyRound, AlertTriangle, CheckCircle, Send, Search } from 'lucide-react'

function DocumentationPage() {
  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <main className='flex-1 p-8 mx-auto w-full max-w-6xl'>
        <div className='flex items-center gap-3 mb-6'>
          <BookOpen className='text-[#08163d]' size={28} />
          <h1 className='font-bold text-2xl text-[#08163d]'>Gateway API Documentation</h1>
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
{`fetch('https://api.rukapay.com/api/v1/gateway/process-transfer', {
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
          <div className='font-semibold text-[#08163d] mb-2'>Base URL</div>
          <div className='text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded'>
            https://api.rukapay.com/api/v1/gateway
          </div>
        </div>

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
  "transactionMode": "PARTNER_SEND_MNO",  // or "PARTNER_SEND_BANK"
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
            Validate a beneficiary account before initiating a money transfer. Verify phone numbers for MNO transfers or bank accounts for bank transfers.
          </div>

          <div className='mb-4'>
            <div className='font-semibold text-[#08163d] mb-2'>Request Body</div>
            <pre className='bg-gray-100 rounded p-4 text-xs font-mono overflow-x-auto'>
{`{
  "transactionMode": "PARTNER_SEND_MNO",  // or "PARTNER_SEND_BANK"
  
  // For MNO validation:
  "phoneNumber": "256700000000",
  "mnoProvider": "MTN",  // or "AIRTEL"
  
  // For Bank validation:
  "accountNumber": "1234567890",
  "bankCode": "STANBIC",
  
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
              <li>For MNO: Returns account holder name if available</li>
              <li>For BANK: Validates account number and returns account holder name</li>
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
{`// Using system reference
GET /api/v1/gateway/transactions/TXN_1764857915115/status
Headers: {
  "x-api-key": "YOUR_API_KEY"
}

// Using partner reference
GET /api/v1/gateway/transactions/PARTNER-REF-123454/status
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

        {/* Error Handling */}
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
          </div>
        </div>
      </main>
    </div>
  )
}

export default DocumentationPage
