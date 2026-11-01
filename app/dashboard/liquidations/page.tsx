"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  Banknote,
  Loader2,
  RefreshCw,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePartnerPermissions } from "@/hooks/use-partner-permissions"
import {
  LIQUIDATION_AUTO_PAYOUT_THRESHOLD,
  getPartnerInstitutionWallet,
  initiatePartnerLiquidation,
  listPartnerInstitutionTransactions,
  listPartnerInstitutions,
  type LiquidationPayoutMethod,
  type PartnerInstitutionSummary,
  type PartnerInstitutionWallet,
} from "@/lib/api"

function toNumber(value: unknown): number {
  if (typeof value === "number") return value
  if (typeof value === "string") return Number(value)
  return NaN
}

function formatUgx(amount: number): string {
  if (!Number.isFinite(amount)) return "—"
  return `UGX ${amount.toLocaleString()}`
}

type HistoryRow = {
  id: string
  reference?: string | null
  amount: number
  status: string
  createdAt?: string
  payoutMethod?: string | null
}

export default function LiquidationsPage() {
  const { isOwner, canManageMembers, loading: permissionsLoading } =
    usePartnerPermissions()
  const canLiquidate = isOwner || canManageMembers

  const [institutions, setInstitutions] = useState<PartnerInstitutionSummary[]>(
    [],
  )
  const [institutionId, setInstitutionId] = useState("")
  const [wallet, setWallet] = useState<PartnerInstitutionWallet | null>(null)
  const [history, setHistory] = useState<HistoryRow[]>([])
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [amount, setAmount] = useState("")
  const [payoutMethod, setPayoutMethod] =
    useState<LiquidationPayoutMethod>("MTN")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankAccountNumber, setBankAccountNumber] = useState("")
  const [bankAccountName, setBankAccountName] = useState("")
  const [reason, setReason] = useState("")

  const amountValue = toNumber(amount)
  const isManualInitiation =
    Number.isFinite(amountValue) &&
    amountValue > LIQUIDATION_AUTO_PAYOUT_THRESHOLD
  const availableBalance = toNumber(wallet?.balance)

  const loadInstitutions = useCallback(async () => {
    setLoadingMeta(true)
    setError(null)
    try {
      const rows = await listPartnerInstitutions("ACTIVE")
      const active = rows.filter(
        (r) => String(r.status || "ACTIVE").toUpperCase() !== "DELETED",
      )
      setInstitutions(active)
      setInstitutionId((prev) => prev || active[0]?.id || "")
    } catch (err: any) {
      setError(err?.message || "Failed to load institutions")
    } finally {
      setLoadingMeta(false)
    }
  }, [])

  const loadWalletAndHistory = useCallback(async (id: string) => {
    if (!id) return
    setLoadingWallet(true)
    setError(null)
    try {
      const [walletRes, txRes] = await Promise.all([
        getPartnerInstitutionWallet(id),
        listPartnerInstitutionTransactions(id, {
          type: "LIQUIDATION",
          page: 1,
          limit: 20,
        }),
      ])
      setWallet(walletRes)
      const items = Array.isArray(txRes?.data?.items)
        ? txRes.data.items
        : Array.isArray(txRes?.items)
          ? txRes.items
          : Array.isArray(txRes?.data)
            ? txRes.data
            : []
      setHistory(
        items.map((row: any) => ({
          id: String(row.id || row.transactionId || ""),
          reference: row.reference || row.partnerReference || null,
          amount: toNumber(row.amount),
          status: String(row.status || "UNKNOWN"),
          createdAt: row.createdAt,
          payoutMethod:
            row.payoutMethod ||
            row.metadata?.payoutMethod ||
            null,
        })),
      )
    } catch (err: any) {
      setWallet(null)
      setHistory([])
      setError(err?.message || "Failed to load wallet / liquidation history")
    } finally {
      setLoadingWallet(false)
    }
  }, [])

  useEffect(() => {
    void loadInstitutions()
  }, [loadInstitutions])

  useEffect(() => {
    if (institutionId) {
      void loadWalletAndHistory(institutionId)
    }
  }, [institutionId, loadWalletAndHistory])

  const selectedInstitution = useMemo(
    () => institutions.find((i) => i.id === institutionId) || null,
    [institutions, institutionId],
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!canLiquidate) {
      setError("You do not have permission to request liquidations.")
      return
    }
    if (!institutionId) {
      setError("Select a SACCO / institution first.")
      return
    }
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setError("Enter a valid amount greater than 0.")
      return
    }
    if (Number.isFinite(availableBalance) && amountValue > availableBalance) {
      setError(
        `Insufficient settlement wallet balance. Available: ${formatUgx(availableBalance)}.`,
      )
      return
    }

    if (payoutMethod === "MTN" || payoutMethod === "AIRTEL") {
      if (!phoneNumber.trim()) {
        setError("Mobile money phone number is required.")
        return
      }
    } else if (!bankName.trim() || !bankAccountNumber.trim()) {
      setError("Bank name and account number are required.")
      return
    }

    setSubmitting(true)
    try {
      const response = await initiatePartnerLiquidation(institutionId, {
        amount: amountValue,
        payoutMethod,
        reason: reason.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        mnoProvider:
          payoutMethod === "MTN" || payoutMethod === "AIRTEL"
            ? payoutMethod
            : undefined,
        bankName: bankName.trim() || undefined,
        bankAccountNumber: bankAccountNumber.trim() || undefined,
        bankAccountName: bankAccountName.trim() || undefined,
      })

      const mode = String(
        response?.processingMode || response?.data?.processingMode || "",
      )
      const message =
        response?.data?.message ||
        response?.message ||
        (mode === "MANUAL_REVIEW"
          ? "Liquidation initiated for manual review."
          : "Liquidation submitted.")

      setSuccess(message)
      setAmount("")
      setPhoneNumber("")
      setBankAccountNumber("")
      setBankAccountName("")
      setReason("")
      await loadWalletAndHistory(institutionId)
    } catch (err: any) {
      setError(err?.message || "Failed to submit liquidation")
    } finally {
      setSubmitting(false)
    }
  }

  if (permissionsLoading || loadingMeta) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading liquidations…
      </div>
    )
  }

  if (!canLiquidate) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          You do not have permission to request liquidations on this partner
          account.
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#08163d]">
            Liquidations
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Move settlement wallet funds to mobile money or bank. Amounts up to{" "}
            {formatUgx(LIQUIDATION_AUTO_PAYOUT_THRESHOLD)} process automatically;
            larger amounts are submitted for RukaPay manual review.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => institutionId && loadWalletAndHistory(institutionId)}
          disabled={!institutionId || loadingWallet}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loadingWallet ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Institution (SACCO)
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select institution
              </option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name || inst.code || inst.id}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="font-medium text-[#08163d]">
              {selectedInstitution?.name || "Settlement wallet"}
            </div>
            <div className="mt-1">
              Available balance:{" "}
              <span className="font-semibold">
                {loadingWallet ? "…" : formatUgx(availableBalance)}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="liq-amount"
              className="text-sm font-medium text-slate-700"
            >
              Amount (UGX)
            </label>
            <Input
              id="liq-amount"
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1000000"
              required
            />
            {isManualInitiation ? (
              <p className="text-xs text-amber-700">
                Above {formatUgx(LIQUIDATION_AUTO_PAYOUT_THRESHOLD)} — this will
                be an initiation only and awaits RukaPay manual processing.
              </p>
            ) : Number.isFinite(amountValue) && amountValue > 0 ? (
              <p className="text-xs text-emerald-700">
                Within auto threshold — MoMo/bank payout will process
                automatically after submit.
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Payout method
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={payoutMethod}
              onChange={(e) =>
                setPayoutMethod(e.target.value as LiquidationPayoutMethod)
              }
            >
              <option value="MTN">Mobile Money — MTN</option>
              <option value="AIRTEL">Mobile Money — Airtel</option>
              <option value="BANK">Bank account</option>
            </select>
          </div>

          {payoutMethod === "MTN" || payoutMethod === "AIRTEL" ? (
            <div className="space-y-1.5">
              <label
                htmlFor="liq-phone"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700"
              >
                <Smartphone className="h-3.5 w-3.5" />
                Mobile money phone
              </label>
              <Input
                id="liq-phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="2567XXXXXXXX"
                required
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="liq-bank-name"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700"
                >
                  <Banknote className="h-3.5 w-3.5" />
                  Bank name
                </label>
                <Input
                  id="liq-bank-name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Stanbic Bank"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="liq-bank-account"
                  className="text-sm font-medium text-slate-700"
                >
                  Account number
                </label>
                <Input
                  id="liq-bank-account"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="liq-bank-account-name"
                  className="text-sm font-medium text-slate-700"
                >
                  Account name
                </label>
                <Input
                  id="liq-bank-account-name"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="liq-reason"
              className="text-sm font-medium text-slate-700"
            >
              Reason / narration
            </label>
            <textarea
              id="liq-reason"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional note for this liquidation"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#08163d] hover:bg-[#0c2258]"
            disabled={submitting || !institutionId}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : isManualInitiation ? (
              "Initiate liquidation (manual review)"
            ) : (
              "Liquidate now"
            )}
          </Button>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recent liquidations
          </h2>
          <div className="mt-4 space-y-3">
            {loadingWallet && history.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading history…
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-slate-500">
                No liquidation requests yet.
              </p>
            ) : (
              history.map((row) => (
                <div
                  key={row.id || row.reference || Math.random().toString(36)}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-[#08163d]">
                        {formatUgx(row.amount)}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {row.reference || row.id}
                        {row.payoutMethod ? ` · ${row.payoutMethod}` : ""}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        String(row.status).toUpperCase() === "SUCCESS"
                          ? "bg-emerald-100 text-emerald-800"
                          : String(row.status).toUpperCase() === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                  {row.createdAt && (
                    <div className="mt-1 text-[11px] text-slate-400">
                      {new Date(row.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
