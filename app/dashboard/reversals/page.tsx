"use client"

import React, { useCallback, useEffect, useState } from "react"
import {
  listPartnerReversalRequests,
  submitPartnerReversalRequest,
  cancelPartnerReversalRequest,
  PartnerReversalStatus,
} from "@/lib/api"
import { usePartnerPermissions } from "@/hooks/use-partner-permissions"
import { AlertCircle, Eye, Loader2, XCircle } from "lucide-react"

interface PartnerReversalRequest {
  id: string
  transactionId: string
  partnerId: string
  reason: string
  details?: string | null
  status: PartnerReversalStatus
  createdAt: string
  reviewedAt?: string | null
  cancelledAt?: string | null
  reviewNote?: string | null
  transaction?: {
    id: string
    reference?: string
    amount: number
    currency: string
    status: string
    type: string
    createdAt: string
  } | null
}

interface PartnerReversalListResponse {
  success: boolean
  data: PartnerReversalRequest[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export default function PartnerReversalsPage() {
  const { loading: permissionsLoading } = usePartnerPermissions()

  const [statusFilter, setStatusFilter] = useState<"" | PartnerReversalStatus>("")
  const [page, setPage] = useState(1)
  const [limit] = useState(20)

  const [data, setData] = useState<PartnerReversalListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<PartnerReversalRequest | null>(null)
  const [confirmingCancelForId, setConfirmingCancelForId] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  const fetchReversals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await listPartnerReversalRequests({
        page,
        limit,
        status: statusFilter || undefined,
      })
      setData(res as PartnerReversalListResponse)
    } catch (err: any) {
      console.error("Error loading partner reversal requests", err)
      setError(err.message || "Failed to load reversal requests")
    } finally {
      setLoading(false)
    }
  }, [page, limit, statusFilter])

  useEffect(() => {
    fetchReversals()
  }, [fetchReversals])

  const totalPages = data?.meta?.totalPages || 1

  const handleCancel = async (id: string) => {
    try {
      setError(null)
      setCancelLoading(true)
      await cancelPartnerReversalRequest(id)
      await fetchReversals()
    } catch (err: any) {
      console.error("Failed to cancel reversal request", err)
      setError(err.message || "Failed to cancel reversal request")
    } finally {
      setCancelLoading(false)
      setConfirmingCancelForId(null)
    }
  }

  if (permissionsLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-5xl">
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-6 lg:p-8 mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#08163d]">Reversal Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track the status of all reversal requests submitted from your transactions.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* List of reversal requests */}
        <section className="bg-white rounded-2xl shadow-md p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-lg font-semibold text-[#08163d]">My Reversal Requests</h2>
              <p className="text-xs text-gray-500">
                Status: PENDING, APPROVED, REJECTED, CANCELLED
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Status</label>
                <select
                  className="border rounded-md px-2 py-1 text-sm w-40"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as PartnerReversalStatus | "")
                    setPage(1)
                  }}
                >
                  <option value="">All</option>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-500 flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading reversal requests...</span>
            </div>
          ) : !data?.data?.length ? (
            <div className="py-8 text-center text-gray-500">
              No reversal requests found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-2">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                      <th className="px-2 py-2 border-b">#</th>
                      <th className="px-2 py-2 border-b">Transaction Ref</th>
                      <th className="px-2 py-2 border-b">Amount</th>
                      <th className="px-2 py-2 border-b">Status</th>
                      <th className="px-2 py-2 border-b">Reason</th>
                      <th className="px-2 py-2 border-b">Created</th>
                      <th className="px-2 py-2 border-b text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((req, index) => {
                      const amount = req.transaction?.amount ?? 0
                      const currency = req.transaction?.currency ?? ""
                      const created = new Date(req.createdAt).toLocaleString()
                      const isPending = req.status === "PENDING"

                      return (
                        <tr key={req.id} className="border-b last:border-b-0">
                          <td className="px-2 py-2 text-xs font-mono">
                            {(index + 1).toString().padStart(3, "0")}
                          </td>
                          <td className="px-2 py-2">
                            <div className="text-xs font-mono">
                              {req.transaction?.reference || req.transaction?.id || "—"}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {req.transaction?.type} · {req.transaction?.status}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-sm">
                            {amount.toLocaleString()} {currency}
                          </td>
                          <td className="px-2 py-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                req.status === "PENDING"
                                  ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                                  : req.status === "APPROVED"
                                  ? "bg-green-50 text-green-800 border border-green-200"
                                  : req.status === "REJECTED"
                                  ? "bg-red-50 text-red-800 border border-red-200"
                                  : "bg-gray-50 text-gray-700 border border-gray-200"
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-xs max-w-xs">
                            <div className="truncate" title={req.reason}>
                              {req.reason}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-500">
                            {created}
                          </td>
                          <td className="px-2 py-2 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedRequest(req)}
                                className="inline-flex items-center px-2 py-1 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </button>
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => setConfirmingCancelForId(req.id)}
                                  className="inline-flex items-center px-2 py-1 rounded-md border border-red-200 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
                                  disabled={cancelLoading}
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <div>
                  Page {data.meta.page} of {totalPages} · Total {data.meta.total}{" "}
                  request{data.meta.total === 1 ? "" : "s"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Detail modal */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold text-[#08163d] mb-1">Reversal Details</h2>
              <p className="text-xs text-gray-500 mb-4">
                Full information about this reversal request.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Request ID</span>
                  <span className="font-mono text-xs break-all">{selectedRequest.id}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Transaction Ref</span>
                  <span className="font-mono text-xs break-all">
                    {selectedRequest.transaction?.reference ||
                      selectedRequest.transaction?.id ||
                      "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Amount</span>
                  <span>
                    {(selectedRequest.transaction?.amount ?? 0).toLocaleString()}{" "}
                    {selectedRequest.transaction?.currency}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Transaction Status</span>
                  <span>{selectedRequest.transaction?.status || "—"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Reversal Status</span>
                  <span>{selectedRequest.status}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Created At</span>
                  <span>{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                </div>
                {selectedRequest.reviewedAt && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Reviewed At</span>
                    <span>{new Date(selectedRequest.reviewedAt).toLocaleString()}</span>
                  </div>
                )}
                {selectedRequest.cancelledAt && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Cancelled At</span>
                    <span>{new Date(selectedRequest.cancelledAt).toLocaleString()}</span>
                  </div>
                )}
                <div>
                  <span className="block text-gray-500 mb-1">Reason</span>
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {selectedRequest.reason}
                  </p>
                </div>
                {selectedRequest.details && (
                  <div>
                    <span className="block text-gray-500 mb-1">Details</span>
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {selectedRequest.details}
                    </p>
                  </div>
                )}
                {selectedRequest.reviewNote && (
                  <div>
                    <span className="block text-gray-500 mb-1">Review Note</span>
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {selectedRequest.reviewNote}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel confirmation modal */}
        {confirmingCancelForId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-[#08163d]">Cancel reversal request?</h2>
              <p className="text-sm text-gray-600">
                This will cancel the pending reversal request. You can create a new request again
                later for the same transaction if needed.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmingCancelForId(null)}
                  className="px-3 py-1.5 rounded-md border text-sm"
                  disabled={cancelLoading}
                >
                  Keep request
                </button>
                <button
                  type="button"
                  onClick={() => handleCancel(confirmingCancelForId)}
                  disabled={cancelLoading}
                  className="inline-flex items-center px-4 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-60"
                >
                  {cancelLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Yes, cancel"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
