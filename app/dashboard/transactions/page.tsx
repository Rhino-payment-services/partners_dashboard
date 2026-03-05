 "use client"

 import React, { useEffect, useState, useCallback } from "react"
 import { getPartnerTransactions } from "@/lib/api"
 import { ArrowUpDown, Loader2, AlertCircle, Eye } from "lucide-react"
 import { usePartnerPermissions } from "@/hooks/use-partner-permissions"

 interface PartnerTransaction {
   id: string
   reference: string | null
   externalReference: string | null
   externalId?: string | null
   type: string
   status: string
   amount: number
   currency: string
   fee: number
   netAmount: number
   direction: string | null
   mode: string | null
   channel: string | null
   description: string | null
   recipientAccount?: string | null
   recipientName?: string | null
   providerName?: string | null
   providerType?: string | null
   partnerReference?: string | null
   createdAt: string
   processedAt: string | null
   // Optional metadata payload from backend (PARTNER_COLLECT, etc.)
   metadata?: any
 }

interface TransactionResponse {
  items: PartnerTransaction[]
  total: number
  page: number
  pageSize: number
}

 export default function TransactionsPage() {
   const { canViewTransactions, loading: permissionsLoading } = usePartnerPermissions()
   const [data, setData] = useState<TransactionResponse | null>(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(20)
   const [statusFilter, setStatusFilter] = useState<string>("")
   const [typeFilter, setTypeFilter] = useState<string>("")
   const [directionFilter, setDirectionFilter] = useState<string>("")
   const [channelFilter, setChannelFilter] = useState<string>("")
   const [search, setSearch] = useState<string>("")
   const [minAmount, setMinAmount] = useState<string>("")
   const [maxAmount, setMaxAmount] = useState<string>("")
   const [fromDate, setFromDate] = useState<string>("")
   const [toDate, setToDate] = useState<string>("")
   // Transaction details modal state
   const [showDetailsModal, setShowDetailsModal] = useState(false)
   const [selectedTx, setSelectedTx] = useState<PartnerTransaction | null>(null)

   const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1

   const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getPartnerTransactions({
        page,
        pageSize,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        direction: directionFilter || undefined,
        channel: channelFilter || undefined,
        search: search || undefined,
        minAmount: minAmount ? Number(minAmount) : undefined,
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      })
      setData(result)
    } catch (err: any) {
      console.error("Error fetching transactions", err)
      setError(err.message || "Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, statusFilter, typeFilter, directionFilter, channelFilter, search, minAmount, maxAmount, fromDate, toDate])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleResetFilters = () => {
    setStatusFilter("")
    setTypeFilter("")
    setDirectionFilter("")
    setChannelFilter("")
    setSearch("")
    setMinAmount("")
    setMaxAmount("")
    setFromDate("")
    setToDate("")
    setPage(1)
  }

  const handleExportCsv = () => {
    if (!data || !data.items.length) return
    const headers = ["Date", "Reference", "Partner Reference", "Type", "Direction", "Status", "Channel", "Amount", "Currency", "Fee", "NetAmount"]
    const rows = data.items.map((tx) => {
      const created = new Date(tx.createdAt)
      const dateStr = created.toISOString()
      return [
        dateStr,
        tx.reference || tx.externalReference || "",
        tx.partnerReference || "",
        tx.type,
        tx.direction || "",
        tx.status,
        tx.channel || "",
        tx.amount,
        tx.currency,
        tx.fee,
        tx.netAmount,
      ]
    })
    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "transactions.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExportJson = () => {
    if (!data || !data.items.length) return
    const blob = new Blob([JSON.stringify(data.items, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "transactions.json")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Check permissions
  if (permissionsLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-7xl">
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </main>
      </div>
    )
  }

  if (!canViewTransactions) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-7xl">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">Access Denied</h2>
            <p className="text-red-600 dark:text-red-300">
              You don't have permission to view transactions. Please contact your administrator.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#08163d]">Transactions</h1>
            <p className="text-sm text-gray-500 mt-1">
              All transactions processed via your RukaPay partner account.
            </p>
          </div>
          {data && (
            <div className="text-right text-sm text-gray-500">
              <div>Total: <span className="font-semibold text-[#08163d]">{data.total}</span></div>
              <div>Page {page} of {totalPages}</div>
            </div>
          )}
        </div>

        {/* Filters & actions */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Search (ref / description)</label>
              <input
                className="border rounded-md px-2 py-1 text-sm w-48"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Status</label>
              <select
                className="border rounded-md px-2 py-1 text-sm w-32"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              >
                <option value="">All</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Direction</label>
              <select
                className="border rounded-md px-2 py-1 text-sm w-32"
                value={directionFilter}
                onChange={(e) => { setDirectionFilter(e.target.value); setPage(1) }}
              >
                <option value="">All</option>
                <option value="DEBIT">Debit</option>
                <option value="CREDIT">Credit</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Channel</label>
              <input
                className="border rounded-md px-2 py-1 text-sm w-32"
                placeholder="WEB / API..."
                value={channelFilter}
                onChange={(e) => { setChannelFilter(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">From date</label>
              <input
                type="date"
                className="border rounded-md px-2 py-1 text-sm"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">To date</label>
              <input
                type="date"
                className="border rounded-md px-2 py-1 text-sm"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Min amount</label>
              <input
                type="number"
                className="border rounded-md px-2 py-1 text-sm w-28"
                value={minAmount}
                onChange={(e) => { setMinAmount(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Max amount</label>
              <input
                type="number"
                className="border rounded-md px-2 py-1 text-sm w-28"
                value={maxAmount}
                onChange={(e) => { setMaxAmount(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleResetFilters}
                className="px-3 py-1 text-xs border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={handleExportCsv}
                className="px-3 py-1 text-xs border rounded-md text-[#08163d] hover:bg-gray-50"
              >
                Export CSV
              </button>
              <button
                onClick={handleExportJson}
                className="px-3 py-1 text-xs border rounded-md text-[#08163d] hover:bg-gray-50"
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="animate-spin mr-2" /> Loading transactions...
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-600 text-sm">{error}</div>
          ) : !data || data.items.length === 0 ? (
            <div className="py-10 text-center text-gray-500 text-sm">No transactions found yet.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b text-xs uppercase">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Reference</th>
                      <th className="py-2 pr-4">Partner Ref</th>
                      <th className="py-2 pr-4 flex items-center gap-1">
                        Amount
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      </th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Direction</th>
                      <th className="py-2 pr-4">Recipient</th>
                      <th className="py-2 pr-4">Provider</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Channel</th>
                      <th className="py-2 pr-4">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((tx) => {
                    const created = new Date(tx.createdAt)
                    const dateStr = created.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })
                    const timeStr = created.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })

                    const isSuccess = tx.status === "SUCCESS"
                    const isPending = tx.status === "PENDING" || tx.status === "PROCESSING"

                    return (
                      <tr key={tx.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-2 pr-4 align-top text-xs text-gray-500">
                          <div>{dateStr}</div>
                          <div>{timeStr}</div>
                        </td>
                        <td className="py-2 pr-4 align-top">
                          <div className="font-mono text-xs text-[#08163d] truncate max-w-[180px]">
                            {tx.reference || tx.externalReference || "—"}
                          </div>
                          {tx.description && (
                            <div className="text-[11px] text-gray-500 truncate max-w-[220px]">
                              {tx.description}
                            </div>
                          )}
                        </td>
                        <td className="py-2 pr-4 align-top">
                          <div className="font-mono text-xs text-gray-700 truncate max-w-[150px]">
                            {tx.partnerReference || "—"}
                          </div>
                        </td>
                        <td className="py-2 pr-4 align-top text-sm font-semibold text-[#08163d]">
                          {tx.currency} {tx.amount.toLocaleString()}
                          {tx.fee > 0 && (
                            <div className="text-[11px] text-gray-400">Fee: {tx.currency} {tx.fee.toLocaleString()}</div>
                          )}
                        </td>
                        <td className="py-2 pr-4 align-top text-xs text-gray-600">{tx.type}</td>
                        <td className="py-2 pr-4 align-top text-xs text-gray-600">{tx.direction || "—"}</td>
                        <td className="py-2 pr-4 align-top text-xs text-gray-600">
                          <div>{tx.recipientAccount || "—"}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {tx.recipientName || "N/A"}
                          </div>
                        </td>
                        <td className="py-2 pr-4 align-top text-xs text-gray-600">
                          {tx.providerName ? (
                            <>
                              {tx.providerName}
                              {tx.providerType && (
                                <span className="ml-1 text-[10px] px-1 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                                  {tx.providerType}
                                </span>
                              )}
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-2 pr-4 align-top text-xs">
                          <span
                            className={
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium " +
                              (isSuccess
                                ? "bg-green-100 text-green-700"
                                : isPending
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700")
                            }
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4 align-top text-xs text-gray-600">{tx.channel || "—"}</td>
                        <td className="py-2 pr-4 align-top text-xs">
                          <button
                            className="px-2 py-1 border rounded-md text-[11px] text-[#08163d] hover:bg-gray-50 flex items-center gap-1"
                            type="button"
                            onClick={() => {
                              setSelectedTx(tx)
                              setShowDetailsModal(true)
                            }}
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select
                    className="border rounded-md px-2 py-1"
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="px-2 py-1 border rounded-md disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Prev
                  </button>
                  <button
                    className="px-2 py-1 border rounded-md disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Transaction details modal */}
        {showDetailsModal && selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg text-[#08163d]">Transaction Details</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedTx.reference || selectedTx.externalReference || selectedTx.id}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setShowDetailsModal(false)
                    setSelectedTx(null)
                  }}
                >
                  Close
                </button>
              </div>

              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 mb-4">
                <div>
                  <div className="text-gray-500">Type</div>
                  <div className="font-mono">{selectedTx.type}</div>
                </div>
                <div>
                  <div className="text-gray-500">Mode</div>
                  <div className="font-mono">{selectedTx.mode || "—"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Direction</div>
                  <div>{selectedTx.direction || "—"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Status</div>
                  <div className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
                    {selectedTx.status}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Amount</div>
                  <div className="font-semibold">
                    {selectedTx.currency} {selectedTx.amount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Fee / Net</div>
                  <div>
                    Fee: {selectedTx.currency} {selectedTx.fee.toLocaleString()}
                    <br />
                    Net: {selectedTx.currency} {selectedTx.netAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Provider</div>
                  <div>
                    {selectedTx.providerName || "—"}
                    {selectedTx.providerType && (
                      <span className="ml-1 text-[10px] px-1 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                        {selectedTx.providerType}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Channel</div>
                  <div>{selectedTx.channel || "—"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Recipient</div>
                  <div>{selectedTx.recipientAccount || "—"}</div>
                  <div className="text-[11px] text-gray-500">
                    {selectedTx.recipientName || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Partner Reference</div>
                  <div className="font-mono text-[11px]">
                    {selectedTx.partnerReference || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Created At</div>
                  <div>
                    {new Date(selectedTx.createdAt).toLocaleString()}
                  </div>
                </div>
                {selectedTx.processedAt && (
                  <div>
                    <div className="text-gray-500">Processed At</div>
                    <div>
                      {new Date(selectedTx.processedAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata / MNO details */}
              {selectedTx.metadata && (
                <div className="mb-4">
                  <h3 className="font-semibold text-sm text-[#08163d] mb-2">Metadata</h3>
                  {(() => {
                    const meta: any = selectedTx.metadata || {}
                    const mnoProvider = meta.mnoProvider || selectedTx.providerName || meta.partnerCode
                    // Prefer true external MNO data; do not treat partnerMetadata as external data
                    const rawExternalData = meta.externalData || meta.externalMetadata
                    const externalData =
                      rawExternalData && typeof rawExternalData === "object" && Object.keys(rawExternalData).length > 0
                        ? rawExternalData
                        : null
                    const partnerMetadata =
                      meta.partnerMetadata && typeof meta.partnerMetadata === "object" && Object.keys(meta.partnerMetadata).length > 0
                        ? meta.partnerMetadata
                        : null

                    const airtelMoneyId =
                      meta.airtelMoneyId ||
                      (externalData && externalData.airtelMoneyId) ||
                      meta.airtel_money_id
                    const externalMessage =
                      (externalData && externalData.message) ||
                      meta.externalMessage ||
                      meta.airtelMessage

                    return (
                      <div className="space-y-2 text-xs text-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {mnoProvider && (
                            <div>
                              <div className="text-gray-500">MNO Provider</div>
                              <div className="font-mono">{mnoProvider}</div>
                            </div>
                          )}
                          {meta.phoneNumber && (
                            <div>
                              <div className="text-gray-500">Phone Number</div>
                              <div>{meta.phoneNumber}</div>
                            </div>
                          )}
                          {airtelMoneyId && (
                            <div>
                              <div className="text-gray-500">Airtel Money ID</div>
                              <div className="font-mono">{airtelMoneyId}</div>
                            </div>
                          )}
                          {externalMessage && (
                            <div className="md:col-span-2">
                              <div className="text-gray-500">External Message</div>
                              <div className="text-gray-700">{externalMessage}</div>
                            </div>
                          )}
                        </div>

                        {/* Raw externalData: MNO / gateway external response */}
                        {externalData && (
                          <div className="mt-2">
                            <div className="text-gray-500 mb-1">External Data</div>
                            <pre className="bg-gray-50 border border-gray-200 rounded-md p-2 text-[10px] overflow-x-auto">
                              {JSON.stringify(externalData, null, 2)}
                            </pre>
                          </div>
                        )}

                        {/* Partner metadata (wallet_id, internal_id, etc.) */}
                        {partnerMetadata && (
                          <div className="mt-2">
                            <div className="text-gray-500 mb-1">Partner Metadata</div>
                            <pre className="bg-gray-50 border border-gray-200 rounded-md p-2 text-[10px] overflow-x-auto">
                              {JSON.stringify(partnerMetadata, null, 2)}
                            </pre>
                          </div>
                        )}

                        {/* Full metadata (collapsed) */}
                        <details className="mt-2">
                          <summary className="cursor-pointer text-[11px] text-gray-500">
                            Show full metadata JSON
                          </summary>
                          <pre className="bg-gray-50 border border-gray-200 rounded-md p-2 text-[10px] overflow-x-auto mt-1">
                            {JSON.stringify(meta, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )
                  })()}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="px-3 py-1 text-xs border rounded-md text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setShowDetailsModal(false)
                    setSelectedTx(null)
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
 }
