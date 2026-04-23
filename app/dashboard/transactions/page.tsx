"use client"

import React, { useEffect, useState, useCallback } from "react"
import { getPartnerTransactions, submitPartnerReversalRequest } from "@/lib/api"
import { ArrowUpDown, Loader2, AlertCircle, RotateCcw } from "lucide-react"
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
  const [exporting, setExporting] = useState(false)

  // Reversal popup state
  const [reversalOpen, setReversalOpen] = useState(false)
  const [reversalTx, setReversalTx] = useState<PartnerTransaction | null>(null)
  const [reversalReason, setReversalReason] = useState("")
  const [reversalDetails, setReversalDetails] = useState("")
  const [reversalSubmitting, setReversalSubmitting] = useState(false)
  const [reversalError, setReversalError] = useState<string | null>(null)
  const [reversalSuccess, setReversalSuccess] = useState<string | null>(null)

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

  const fetchAllFilteredTransactions = useCallback(async (): Promise<PartnerTransaction[]> => {
    const exportPageSize = 200
    const firstPage = await getPartnerTransactions({
      page: 1,
      pageSize: exportPageSize,
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

    const allRows: PartnerTransaction[] = Array.isArray(firstPage?.items) ? [...firstPage.items] : []
    const total = Number(firstPage?.total || allRows.length)
    const pages = Math.max(1, Math.ceil(total / exportPageSize))

    for (let p = 2; p <= pages; p += 1) {
      const nextPage = await getPartnerTransactions({
        page: p,
        pageSize: exportPageSize,
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
      if (Array.isArray(nextPage?.items)) {
        allRows.push(...nextPage.items)
      }
    }

    return allRows
  }, [statusFilter, typeFilter, directionFilter, channelFilter, search, minAmount, maxAmount, fromDate, toDate])

  const handleExportCsv = async () => {
    if (!data || !data.total) return
    setExporting(true)
    setError(null)
    let rows: PartnerTransaction[] = []
    try {
      rows = await fetchAllFilteredTransactions()
    } catch (err: any) {
      setError(err?.message || "Failed to export transactions")
      return
    } finally {
      setExporting(false)
    }
    if (!rows.length) return
    const headers = ["Date", "Reference", "Partner Reference", "Type", "Direction", "Status", "Channel", "Amount", "Currency", "Fee", "NetAmount"]
    const csvRows = rows.map((tx) => {
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
    const csvContent = [headers, ...csvRows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const from = fromDate || "all"
    const to = toDate || "all"
    link.setAttribute("download", `transactions-${from}-to-${to}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExportJson = async () => {
    if (!data || !data.total) return
    setExporting(true)
    setError(null)
    let rows: PartnerTransaction[] = []
    try {
      rows = await fetchAllFilteredTransactions()
    } catch (err: any) {
      setError(err?.message || "Failed to export transactions")
      return
    } finally {
      setExporting(false)
    }
    if (!rows.length) return
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const from = fromDate || "all"
    const to = toDate || "all"
    link.setAttribute("download", `transactions-${from}-to-${to}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const openReversalPopup = (tx: PartnerTransaction) => {
    setReversalTx(tx)
    setReversalReason("")
    setReversalDetails("")
    setReversalError(null)
    setReversalSuccess(null)
    setReversalOpen(true)
  }

  const submitReversal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reversalTx || !reversalReason.trim()) return
    try {
      setReversalSubmitting(true)
      setReversalError(null)
      setReversalSuccess(null)
      await submitPartnerReversalRequest({
        transactionId: reversalTx.id,
        reason: reversalReason.trim(),
        details: reversalDetails.trim() || undefined,
      })
      setReversalSuccess("Reversal request submitted successfully. You can track it under Reversal Requests.")
      // Optionally refresh transactions so latest state is visible
      await fetchTransactions()
      // Close the modal after a short delay so the user sees the success state
      setTimeout(() => {
        setReversalOpen(false)
      }, 1200)
    } catch (err: any) {
      console.error("Failed to submit reversal request", err)
      setReversalError(
        err?.message || "Failed to submit reversal request. Please try again."
      )
    } finally {
      setReversalSubmitting(false)
    }
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
                disabled={exporting || !data?.total}
                className="px-3 py-1 text-xs border rounded-md text-[#08163d] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exporting ? "Exporting..." : "Export CSV"}
              </button>
              <button
                onClick={handleExportJson}
                disabled={exporting || !data?.total}
                className="px-3 py-1 text-xs border rounded-md text-[#08163d] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <th className="py-2 pr-4 text-right">Actions</th>
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
                        <td className="py-2 pr-4 align-top text-xs text-right">
                          <button
                            type="button"
                            onClick={() => openReversalPopup(tx)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 text-[11px] text-[#08163d] hover:bg-gray-50"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Reverse
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
      </main>
      {/* Reversal popup */}
      {reversalOpen && reversalTx && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#08163d] flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Request Reversal
              </h2>
              <button
                type="button"
                onClick={() => setReversalOpen(false)}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {reversalError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {reversalError}
              </div>
            )}
            {reversalSuccess && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {reversalSuccess}
              </div>
            )}

            <div className="text-xs bg-gray-50 rounded-lg p-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono">{reversalTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reference</span>
                <span className="font-mono">{reversalTx.reference || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold">
                  {reversalTx.currency} {reversalTx.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium">{reversalTx.status}</span>
              </div>
            </div>

            <form onSubmit={submitReversal} className="space-y-3">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">
                  Reason <span className="text-red-500">*</span>
                </label>
                <input
                  className="border rounded-md px-2 py-1 text-sm"
                  placeholder="Short reason (e.g. Customer charged twice)"
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Details (optional)</label>
                <textarea
                  className="border rounded-md px-2 py-2 text-sm min-h-[80px]"
                  placeholder="Provide more context for this reversal (customer complaint, logs, etc.)"
                  value={reversalDetails}
                  onChange={(e) => setReversalDetails(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReversalOpen(false)}
                  className="px-3 py-1.5 rounded-md border text-sm"
                  disabled={reversalSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reversalSubmitting || !reversalReason.trim()}
                  className="inline-flex items-center px-4 py-1.5 rounded-md bg-[#08163d] text-white text-sm hover:bg-[#0b1d52] disabled:opacity-60"
                >
                  {reversalSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Submit Reversal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
