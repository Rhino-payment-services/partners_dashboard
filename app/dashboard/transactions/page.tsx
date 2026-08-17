"use client"

import React, { useEffect, useState, useCallback } from "react"
import { getPartnerTransactions, submitPartnerReversalRequest } from "@/lib/api"
import {
  ArrowUpDown,
  Loader2,
  AlertCircle,
  RotateCcw,
  Search,
  Download,
  FileJson,
  Eye,
  X,
} from "lucide-react"
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
  escrowWalletBalance?: number | null
  commissionWalletBalance?: number | null
  createdAt: string
  processedAt: string | null
}

interface TransactionResponse {
  items: PartnerTransaction[]
  total: number
  page: number
  pageSize: number
  showWalletBalances?: boolean
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
  const [fromDate, setFromDate] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().slice(0, 10)
  })
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
  const [selectedTx, setSelectedTx] = useState<PartnerTransaction | null>(null)

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1
  const showWalletBalances = Boolean(data?.showWalletBalances)

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
    // Must match backend max pageSize in partner-auth.service (currently 100).
    const exportPageSize = 100
    const allRows: PartnerTransaction[] = []
    let pageNum = 1
    let total = 0

    while (true) {
      const result = await getPartnerTransactions({
        page: pageNum,
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

      const items = Array.isArray(result?.items) ? result.items : []
      total = Number(result?.total ?? total)
      allRows.push(...items)

      if (items.length === 0 || allRows.length >= total) {
        break
      }
      pageNum += 1
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
    if (data && rows.length < data.total) {
      setError(
        `Export may be incomplete: downloaded ${rows.length} of ${data.total} matching transactions.`,
      )
    }
    const headers = [
      "Date",
      "Reference",
      "Partner Reference",
      "Type",
      "Direction",
      "Status",
      "Channel",
      "Amount",
      "Currency",
      "Fee",
      "NetAmount",
      "Telephone Number",
      "MNO",
      ...(showWalletBalances
        ? ["Escrow Wallet Balance", "Commission Wallet Balance"]
        : []),
    ]
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
        tx.recipientAccount || "",
        tx.providerName || "",
        ...(showWalletBalances
          ? [
              tx.escrowWalletBalance ?? "",
              tx.commissionWalletBalance ?? "",
            ]
          : []),
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
    if (data && rows.length < data.total) {
      setError(
        `Export may be incomplete: downloaded ${rows.length} of ${data.total} matching transactions.`,
      )
    }
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
    <div className="flex min-h-full min-w-0 flex-col bg-[#f8f9fb]">
      <main className="mx-auto w-full min-w-0 max-w-[1600px] flex-1 p-4 md:p-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#08163d]">Transactions</h1>
            <p className="mt-1 text-xs text-slate-500">
              All transactions processed via your RukaPay partner account.
            </p>
          </div>
          {data && (
            <div className="text-right text-[11px] text-slate-500">
              <div><span className="font-semibold text-[#08163d]">{data.total.toLocaleString()}</span> transactions</div>
              <div>Page {page} of {totalPages}</div>
            </div>
          )}
        </div>

        {/* Filters & actions */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex flex-wrap items-end gap-2.5">
            <div className="flex flex-col">
              <label className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">Search</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-8 w-52 rounded-lg border border-slate-200 bg-white pl-8 pr-2 text-xs outline-none transition focus:border-[#08163d]/40 focus:ring-2 focus:ring-[#08163d]/5"
                  placeholder="Reference or description"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">Status</label>
              <select
                className="h-8 w-28 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#08163d]/40"
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
              <label className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">Direction</label>
              <select
                className="h-8 w-28 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#08163d]/40"
                value={directionFilter}
                onChange={(e) => { setDirectionFilter(e.target.value); setPage(1) }}
              >
                <option value="">All</option>
                <option value="DEBIT">Debit</option>
                <option value="CREDIT">Credit</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">Channel</label>
              <input
                className="h-8 w-28 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#08163d]/40"
                placeholder="WEB / API..."
                value={channelFilter}
                onChange={(e) => { setChannelFilter(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">From</label>
              <input
                type="date"
                className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#08163d]/40"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">To</label>
              <input
                type="date"
                className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#08163d]/40"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">Min amount</label>
              <input
                type="number"
                className="h-8 w-24 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#08163d]/40"
                value={minAmount}
                onChange={(e) => { setMinAmount(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">Max amount</label>
              <input
                type="number"
                className="h-8 w-24 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#08163d]/40"
                value={maxAmount}
                onChange={(e) => { setMaxAmount(e.target.value); setPage(1) }}
              />
            </div>
            <div className="ml-auto flex gap-1.5">
              <button
                onClick={handleResetFilters}
                className="h-8 rounded-lg border border-slate-200 px-3 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                onClick={handleExportCsv}
                disabled={exporting || !data?.total}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[11px] font-medium text-[#08163d] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="size-3.5" />
                {exporting ? "Exporting..." : "CSV"}
              </button>
              <button
                onClick={handleExportJson}
                disabled={exporting || !data?.total}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[11px] font-medium text-[#08163d] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FileJson className="size-3.5" />
                JSON
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-14 text-xs text-slate-500">
              <Loader2 className="mr-2 size-4 animate-spin" /> Loading transactions...
            </div>
          ) : error ? (
            <div className="py-14 text-center text-xs text-red-600">{error}</div>
          ) : !data || data.items.length === 0 ? (
            <div className="py-14 text-center text-xs text-slate-500">No transactions found yet.</div>
          ) : (
            <>
              <div className="max-h-[calc(100vh-300px)] overflow-x-auto overflow-y-auto">
                <table className="min-w-full whitespace-nowrap text-left">
                  <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
                    <tr className="border-b border-slate-200 text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      <th className="px-3 py-2.5">Date</th>
                      <th className="px-3 py-2.5">Reference</th>
                      <th className="px-3 py-2.5">Partner Ref</th>
                      <th className="px-3 py-2.5">
                        <span className="flex items-center gap-1">
                        Amount
                          <ArrowUpDown className="size-3 text-slate-300" />
                        </span>
                      </th>
                      {showWalletBalances && (
                        <>
                          <th className="px-3 py-2.5 text-right">Escrow Balance</th>
                          <th className="px-3 py-2.5 text-right">Commission Balance</th>
                        </>
                      )}
                      <th className="px-3 py-2.5">Type</th>
                      <th className="px-3 py-2.5">Direction</th>
                      <th className="px-3 py-2.5">Recipient</th>
                      <th className="px-3 py-2.5">Provider</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5">Channel</th>
                      <th className="px-3 py-2.5 text-right">Action</th>
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
                      <tr key={tx.id} className="group border-b border-slate-100 transition-colors last:border-b-0 hover:bg-[#fafbfe]">
                        <td className="px-3 py-3 align-top text-[10px] text-slate-500">
                          <div className="font-medium text-slate-600">{dateStr}</div>
                          <div className="mt-0.5 text-[9px] text-slate-400">{timeStr}</div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <div className="max-w-[180px] truncate font-mono text-[10px] font-medium text-[#08163d]">
                            {tx.reference || tx.externalReference || "—"}
                          </div>
                          {tx.description && (
                            <div className="mt-0.5 max-w-[200px] truncate text-[9px] text-slate-400">
                              {tx.description}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3 align-top">
                          <div className="max-w-[140px] truncate font-mono text-[10px] text-slate-500">
                            {tx.partnerReference || "—"}
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top text-[11px] font-semibold text-[#08163d]">
                          {tx.currency} {tx.amount.toLocaleString()}
                          {tx.fee > 0 && (
                            <div className="mt-0.5 text-[9px] font-normal text-slate-400">Fee {tx.currency} {tx.fee.toLocaleString()}</div>
                          )}
                        </td>
                        {showWalletBalances && (
                          <>
                            <td className="px-3 py-3 text-right align-top text-[10px] font-medium text-slate-700">
                              {tx.escrowWalletBalance != null
                                ? `${tx.currency} ${Number(tx.escrowWalletBalance).toLocaleString()}`
                                : "—"}
                            </td>
                            <td className="px-3 py-3 text-right align-top text-[10px] font-medium text-slate-700">
                              {tx.commissionWalletBalance != null
                                ? `${tx.currency} ${Number(tx.commissionWalletBalance).toLocaleString()}`
                                : "—"}
                            </td>
                          </>
                        )}
                        <td className="px-3 py-3 align-top text-[10px] font-medium capitalize text-slate-600">
                          {tx.type.toLowerCase().replaceAll("_", " ")}
                        </td>
                        <td className="px-3 py-3 align-top text-[10px] text-slate-500">{tx.direction || "—"}</td>
                        <td className="px-3 py-3 align-top text-[10px] text-slate-600">
                          <div className="max-w-[150px] truncate">{tx.recipientAccount || "—"}</div>
                          <div className="mt-0.5 max-w-[150px] truncate text-[9px] text-slate-400">
                            {tx.recipientName || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top text-[10px] text-slate-600">
                          {tx.providerName ? (
                            <>
                              {tx.providerName}
                              {tx.providerType && (
                                <span className="ml-1 rounded bg-slate-100 px-1 py-0.5 text-[8px] uppercase text-slate-500">
                                  {tx.providerType}
                                </span>
                              )}
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-3 py-3 align-top">
                          <span
                            className={
                              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-semibold capitalize " +
                              (isSuccess
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : isPending
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-rose-200 bg-rose-50 text-rose-700")
                            }
                          >
                            <span className="size-1 rounded-full bg-current" />
                            {tx.status.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-3 py-3 align-top text-[10px] text-slate-500">{tx.channel || "—"}</td>
                        <td className="px-3 py-3 text-right align-top">
                          <button
                            type="button"
                            onClick={() => setSelectedTx(tx)}
                            className="mr-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-semibold text-slate-600 opacity-70 hover:bg-slate-100 hover:text-[#08163d] group-hover:opacity-100"
                          >
                            <Eye className="size-3" />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => openReversalPopup(tx)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-semibold text-[#08163d] opacity-70 hover:bg-[#eef2ff] group-hover:opacity-100"
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
              <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2.5 text-[10px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select
                    className="h-7 rounded-md border border-slate-200 bg-white px-2 outline-none"
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
                    className="h-7 rounded-md border border-slate-200 px-2.5 font-medium hover:bg-slate-50 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Prev
                  </button>
                  <button
                    className="h-7 rounded-md border border-slate-200 px-2.5 font-medium hover:bg-slate-50 disabled:opacity-50"
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

      {/* Transaction details drawer */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close transaction details"
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]"
            onClick={() => setSelectedTx(null)}
          />
          <aside className="relative z-10 flex h-full w-full max-w-md animate-in slide-in-from-right flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-5">
              <div>
                <h2 className="text-sm font-semibold text-[#08163d]">Transaction details</h2>
                <p className="text-[10px] text-slate-400">Complete payment information</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="mb-5 rounded-xl bg-[#08163d] p-4 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/55">Amount</p>
                    <p className="mt-1 text-xl font-semibold">
                      {selectedTx.currency} {selectedTx.amount.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold capitalize ${
                      selectedTx.status === "SUCCESS"
                        ? "bg-emerald-400/15 text-emerald-300"
                        : selectedTx.status === "PENDING" || selectedTx.status === "PROCESSING"
                          ? "bg-amber-400/15 text-amber-300"
                          : "bg-rose-400/15 text-rose-300"
                    }`}
                  >
                    <span className="size-1 rounded-full bg-current" />
                    {selectedTx.status.toLowerCase()}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-3 text-[10px]">
                  <div>
                    <p className="text-white/45">Fee</p>
                    <p className="mt-0.5 font-medium">{selectedTx.currency} {selectedTx.fee.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white/45">Net amount</p>
                    <p className="mt-0.5 font-medium">{selectedTx.currency} {selectedTx.netAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <section className="mb-5">
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Transaction
                </h3>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                  {[
                    ["Reference", selectedTx.reference || selectedTx.externalReference || "—"],
                    ["Partner reference", selectedTx.partnerReference || "—"],
                    ["Transaction ID", selectedTx.id],
                    ["Type", selectedTx.type.toLowerCase().replaceAll("_", " ")],
                    ["Direction", selectedTx.direction || "—"],
                    ["Channel", selectedTx.channel || "—"],
                    ["Mode", selectedTx.mode || "—"],
                    ["Created", new Date(selectedTx.createdAt).toLocaleString()],
                    ["Processed", selectedTx.processedAt ? new Date(selectedTx.processedAt).toLocaleString() : "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-5 px-3 py-2.5 text-[10px]">
                      <span className="shrink-0 text-slate-400">{label}</span>
                      <span className={`text-right font-medium capitalize text-slate-700 ${label.includes("ID") || label.includes("Reference") ? "break-all font-mono" : ""}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-5">
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Recipient & provider
                </h3>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                  {[
                    ["Recipient name", selectedTx.recipientName || "—"],
                    ["Recipient account", selectedTx.recipientAccount || "—"],
                    ["Provider", selectedTx.providerName || "—"],
                    ["Provider type", selectedTx.providerType || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-5 px-3 py-2.5 text-[10px]">
                      <span className="shrink-0 text-slate-400">{label}</span>
                      <span className="break-all text-right font-medium text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {showWalletBalances && (
                <section className="mb-5">
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Wallet balances
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-[9px] text-slate-400">Escrow balance</p>
                      <p className="mt-1 text-xs font-semibold text-[#08163d]">
                        {selectedTx.escrowWalletBalance != null
                          ? `${selectedTx.currency} ${Number(selectedTx.escrowWalletBalance).toLocaleString()}`
                          : "—"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-[9px] text-slate-400">Commission balance</p>
                      <p className="mt-1 text-xs font-semibold text-[#08163d]">
                        {selectedTx.commissionWalletBalance != null
                          ? `${selectedTx.currency} ${Number(selectedTx.commissionWalletBalance).toLocaleString()}`
                          : "—"}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {selectedTx.description && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Description
                  </h3>
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[10px] leading-5 text-slate-600">
                    {selectedTx.description}
                  </p>
                </section>
              )}
            </div>

            <div className="flex shrink-0 gap-2 border-t border-slate-200 p-4">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="h-9 flex-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const tx = selectedTx
                  setSelectedTx(null)
                  openReversalPopup(tx)
                }}
                className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#08163d] text-[11px] font-semibold text-white hover:bg-[#0b1d52]"
              >
                <RotateCcw className="size-3.5" />
                Request reversal
              </button>
            </div>
          </aside>
        </div>
      )}

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
