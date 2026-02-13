"use client"

import React from "react"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"

/** Tazapay-style payment gateway illustration - country status grid + success rates */
export default function PaymentGatewayIllustration({ className }: { className?: string }) {
  const regions = [
    { name: "Uganda", status: "ACTIVE", color: "bg-emerald-500" },
    { name: "Kenya", status: "ACTIVE", color: "bg-emerald-500" },
    { name: "Tanzania", status: "On Hold", color: "bg-amber-500" },
    { name: "Rwanda", status: "ONBOARDED", color: "bg-sky-400" },
    { name: "MTN MoMo", status: "ACTIVE", color: "bg-emerald-500" },
    { name: "Airtel Money", status: "ACTIVE", color: "bg-emerald-500" },
    { name: "Bank Transfer", status: "ONBOARDED", color: "bg-sky-400" },
  ]

  return (
    <div className={`w-full max-w-md ${className || ""}`}>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-5 space-y-4">
        {/* Integration status grid */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {regions.map((r, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium">STATUS</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-6 rounded bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded text-white ${r.color}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#08163d] text-white text-sm font-medium hover:bg-[#08163d]/90 transition">
            <Plus className="w-4 h-4" />
            Add New Integration
          </button>
        </div>

        {/* Success rates */}
        <div className="pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 font-medium">Success Rates</span>
          <div className="flex items-end justify-between mt-2 gap-4">
            <div>
              <span className="text-3xl font-bold text-[#08163d]">74%</span>
              <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                ▲ 12% vs last week
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-end justify-center pb-1">
                  <div className="w-4 bg-emerald-500 rounded-t" style={{ height: "80%" }} />
                </div>
                <span className="text-[10px] text-gray-500 block mt-1">Jan</span>
                <span className="text-[10px] text-emerald-600 font-medium">▲ 86%</span>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-end justify-center pb-1">
                  <div className="w-4 bg-amber-400 rounded-t" style={{ height: "60%" }} />
                </div>
                <span className="text-[10px] text-gray-500 block mt-1">Dec</span>
                <span className="text-[10px] text-amber-600 font-medium">▼ 74%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
