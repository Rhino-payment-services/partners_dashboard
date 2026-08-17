"use client"

import React, { useCallback, useEffect, useState } from "react"
import {
  listPartnerReversalRequests,
  cancelPartnerReversalRequest,
  PartnerReversalStatus,
} from "@/lib/api"
import { usePartnerPermissions } from "@/hooks/use-partner-permissions"
import { AlertCircle, Eye, Loader2, X, XCircle } from "lucide-react"

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

function statusPillClass(status: string) {
  if (status === "APPROVED" || status === "SUCCESS") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }
  if (status === "PENDING" || status === "PROCESSING") {
    return "border-amber-200 bg-amber-50 text-amber-700"
  }
  if (status === "REJECTED" || status === "FAILED") {
    return "border-rose-200 bg-rose-50 text-rose-700"
  }
  return "border-slate-200 bg-slate-50 text-slate-600"
}

function drawerStatusClass(status: string) {
  if (status === "APPROVED") return "bg-emerald-400/15 text-emerald-300"
  if (status === "PENDING") return "bg-amber-400/15 text-amber-300"
  if (status === "REJECTED") return "bg-rose-400/15 text-rose-300"
  return "bg-white/10 text-white/70"
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
      setSelectedRequest(null)
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
      <div className="flex min-h-full min-w-0 flex-col bg-[#f8f9fb]">
        <main className="mx-auto w-full min-w-0 max-w-[1600px] flex-1 p-4 md:p-6">
          <div className="py-8 text-center text-xs text-slate-500">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-full min-w-0 flex-col bg-[#f8f9fb]">
      <main className="mx-auto w-full min-w-0 max-w-[1600px] flex-1 p-4 md:p-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#08163d]">Reversal Requests</h1>
            <p className="mt-1 text-xs text-slate-500">
              Track the status of all reversal requests submitted from your transactions.
            </p>
          </div>
          {data && (
            <div className="text-right text-[11px] text-slate-500">
              <div>
                <span className="font-semibold text-[#08163d]">{data.meta.total.toLocaleString()}</span> requests
              </div>
              <div>Page {page} of {totalPages}</div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            <AlertCircle className="mt-0.5 size-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex flex-wrap items-end gap-2.5">
            <div className="flex flex-col">
              <label className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">Status</label>
              <select
                className="h-8 w-36 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#08163d]/40"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as PartnerReversalStatus | "")
                  setPage(1)
                }}
              >
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-14 text-xs text-slate-500">
              <Loader2 className="mr-2 size-4 animate-spin" /> Loading reversal requests...
            </div>
          ) : !data?.data?.length ? (
            <div className="py-14 text-center text-xs text-slate-500">No reversal requests found.</div>
          ) : (
            <>
              <div className="max-h-[calc(100vh-300px)] overflow-x-auto overflow-y-auto">
                <table className="min-w-full whitespace-nowrap text-left">
                  <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
                    <tr className="border-b border-slate-200 text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      <th className="px-3 py-2.5">#</th>
                      <th className="px-3 py-2.5">Transaction Ref</th>
                      <th className="px-3 py-2.5">Amount</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5">Reason</th>
                      <th className="px-3 py-2.5">Created</th>
                      <th className="px-3 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((req, index) => {
                      const amount = req.transaction?.amount ?? 0
                      const currency = req.transaction?.currency ?? ""
                      const created = new Date(req.createdAt)
                      const dateStr = created.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })
                      const timeStr = created.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      const isPending = req.status === "PENDING"

                      return (
                        <tr
                          key={req.id}
                          className="group border-b border-slate-100 transition-colors last:border-b-0 hover:bg-[#fafbfe]"
                        >
                          <td className="px-3 py-3 align-top font-mono text-[10px] text-slate-400">
                            {(index + 1 + (page - 1) * limit).toString().padStart(3, "0")}
                          </td>
                          <td className="px-3 py-3 align-top">
                            <div className="max-w-[220px] truncate font-mono text-[10px] font-medium text-[#08163d]">
                              {req.transaction?.reference || req.transaction?.id || "—"}
                            </div>
                            <div className="mt-0.5 text-[9px] capitalize text-slate-400">
                              {(req.transaction?.type || "—").toLowerCase().replaceAll("_", " ")} · {(req.transaction?.status || "—").toLowerCase()}
                            </div>
                          </td>
                          <td className="px-3 py-3 align-top text-[11px] font-semibold text-[#08163d]">
                            {currency} {amount.toLocaleString()}
                          </td>
                          <td className="px-3 py-3 align-top">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-semibold capitalize ${statusPillClass(req.status)}`}
                            >
                              <span className="size-1 rounded-full bg-current" />
                              {req.status.toLowerCase()}
                            </span>
                          </td>
                          <td className="px-3 py-3 align-top text-[10px] text-slate-600">
                            <div className="max-w-[220px] truncate" title={req.reason}>
                              {req.reason}
                            </div>
                          </td>
                          <td className="px-3 py-3 align-top text-[10px] text-slate-500">
                            <div className="font-medium text-slate-600">{dateStr}</div>
                            <div className="mt-0.5 text-[9px] text-slate-400">{timeStr}</div>
                          </td>
                          <td className="px-3 py-3 text-right align-top">
                            <button
                              type="button"
                              onClick={() => setSelectedRequest(req)}
                              className="mr-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-semibold text-slate-600 opacity-70 hover:bg-slate-100 hover:text-[#08163d] group-hover:opacity-100"
                            >
                              <Eye className="size-3" />
                              View
                            </button>
                            {isPending && (
                              <button
                                type="button"
                                onClick={() => setConfirmingCancelForId(req.id)}
                                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-semibold text-rose-600 opacity-70 hover:bg-rose-50 group-hover:opacity-100"
                                disabled={cancelLoading}
                              >
                                <XCircle className="size-3" />
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2.5 text-[10px] text-slate-500">
                <div>
                  Page {data.meta.page} of {totalPages} · Total {data.meta.total}{" "}
                  request{data.meta.total === 1 ? "" : "s"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-7 rounded-md border border-slate-200 px-2.5 font-medium hover:bg-slate-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="h-7 rounded-md border border-slate-200 px-2.5 font-medium hover:bg-slate-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close reversal details"
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]"
            onClick={() => setSelectedRequest(null)}
          />
          <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-5">
              <div>
                <h2 className="text-sm font-semibold text-[#08163d]">Reversal details</h2>
                <p className="text-[10px] text-slate-400">Complete request information</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
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
                      {selectedRequest.transaction?.currency || "UGX"}{" "}
                      {(selectedRequest.transaction?.amount ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold capitalize ${drawerStatusClass(selectedRequest.status)}`}
                  >
                    <span className="size-1 rounded-full bg-current" />
                    {selectedRequest.status.toLowerCase()}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-3 text-[10px]">
                  <div>
                    <p className="text-white/45">Transaction status</p>
                    <p className="mt-0.5 font-medium capitalize">
                      {(selectedRequest.transaction?.status || "—").toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/45">Type</p>
                    <p className="mt-0.5 font-medium capitalize">
                      {(selectedRequest.transaction?.type || "—").toLowerCase().replaceAll("_", " ")}
                    </p>
                  </div>
                </div>
              </div>

              <section className="mb-5">
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Request
                </h3>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                  {[
                    ["Request ID", selectedRequest.id],
                    ["Transaction ref", selectedRequest.transaction?.reference || selectedRequest.transaction?.id || "—"],
                    ["Transaction ID", selectedRequest.transactionId],
                    ["Created", new Date(selectedRequest.createdAt).toLocaleString()],
                    ["Reviewed", selectedRequest.reviewedAt ? new Date(selectedRequest.reviewedAt).toLocaleString() : "—"],
                    ["Cancelled", selectedRequest.cancelledAt ? new Date(selectedRequest.cancelledAt).toLocaleString() : "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-5 px-3 py-2.5 text-[10px]">
                      <span className="shrink-0 text-slate-400">{label}</span>
                      <span
                        className={`break-all text-right font-medium text-slate-700 ${
                          label.includes("ID") || label.includes("ref") ? "font-mono" : ""
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-5">
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Reason
                </h3>
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[10px] leading-5 whitespace-pre-wrap text-slate-600">
                  {selectedRequest.reason}
                </p>
              </section>

              {selectedRequest.details && (
                <section className="mb-5">
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Details
                  </h3>
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[10px] leading-5 whitespace-pre-wrap text-slate-600">
                    {selectedRequest.details}
                  </p>
                </section>
              )}

              {selectedRequest.reviewNote && (
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Review note
                  </h3>
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[10px] leading-5 whitespace-pre-wrap text-slate-600">
                    {selectedRequest.reviewNote}
                  </p>
                </section>
              )}
            </div>

            <div className="flex shrink-0 gap-2 border-t border-slate-200 p-4">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="h-9 flex-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              {selectedRequest.status === "PENDING" && (
                <button
                  type="button"
                  onClick={() => setConfirmingCancelForId(selectedRequest.id)}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-600 text-[11px] font-semibold text-white hover:bg-rose-700"
                >
                  <XCircle className="size-3.5" />
                  Cancel request
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {confirmingCancelForId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="text-lg font-semibold text-[#08163d]">Cancel reversal request?</h2>
            <p className="text-sm text-gray-600">
              This will cancel the pending reversal request. You can create a new request again
              later for the same transaction if needed.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmingCancelForId(null)}
                className="rounded-md border px-3 py-1.5 text-sm"
                disabled={cancelLoading}
              >
                Keep request
              </button>
              <button
                type="button"
                onClick={() => handleCancel(confirmingCancelForId)}
                disabled={cancelLoading}
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-60"
              >
                {cancelLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
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
    </div>
  )
}
