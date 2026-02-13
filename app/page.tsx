"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gem, Users, Wallet, Coins, Shield, DollarSign, Check } from "lucide-react";
import PaymentGatewayIllustration from "@/components/PaymentGatewayIllustration";
import { isSignupAllowed } from "@/lib/env";

export default function PartnersLandingPage() {
  const signupAllowed = isSignupAllowed();
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar - CipherBC style, Home & Documentation only */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - hide "RukaPay" text on mobile */}
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.jpg" alt="RukaPay" width={40} height={40} className="rounded-lg object-cover" />
              <span className="hidden md:inline text-2xl font-bold text-[#08163d]">RukaPay</span>
            </Link>

            {/* Navigation Links - Home and Documentation only */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-[#08163d] font-medium transition hover:text-[#08163d]/80"
              >
                Home
              </Link>
              <Link
                href="/dashboard/documentation"
                className="text-gray-600 hover:text-[#08163d] font-medium transition"
              >
                Documentation
              </Link>
            </div>

            {/* Action Buttons - Tazapay style */}
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5"
                >
                  Login
                </Button>
              </Link>
              {signupAllowed && (
                <Link href="/auth/signup">
                  <Button className="bg-[#08163d] hover:bg-[#08163d]/90 text-white px-6">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Tazapay style */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-[150px] bg-white min-h-[calc(100vh-100px)]">
        <div className="max-w-7xl mx-auto w-full">
          {/* First row: Left content horizontal with illustration */}
          <div className="grid lg:grid-cols-2 gap-12  py-[100px] ">
            {/* Left - Heading, subtitle, CTA */}
            <div className="flex flex-col gap-4">
               <h1 className="text-4xl md:text-5xl lg:text-[60px] font-bold text-[#08163d] leading-tight">
               RukaPay Uganda's Payment Gateway
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Your Gateway to Uganda's Payment Success
              </p>
              <p className="text-gray-600 mb-8">
               allow your customers to pay you in Uganda's most popular payment methods.form outside Uganda.
              </p>
              {signupAllowed ? (
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-[#08163d] hover:bg-[#08163d]/90 text-white px-8 py-3 h-auto text-base"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    className="bg-[#08163d] hover:bg-[#08163d]/90 text-white px-8 py-3 h-auto text-base"
                  >
                    Login to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Right - Payment gateway illustration card */}
            <div className="flex justify-center lg:justify-end">
              <PaymentGatewayIllustration />
            </div>
          </div>
{/* trusted by section - infinite marquee */}
  <div className="flex flex-col items-center justify-center py-8">
  <h2 className="text-2xl md:text-3xl font-bold text-[#08163d] mb-8">
    Trusted by the Best
  </h2>
          <div className="relative w-full overflow-hidden">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            {/* Marquee track */}
            <div className="flex animate-marquee">
              {[1, 2, 3].map((set) => (
                <div key={set} className="flex flex-shrink-0 gap-10">
                  {[
                    { src: "/images/bou-logo.png", alt: "BOU", w: "w-[150px]" },
                    { src: "/images/equity-bank-logo.png", alt: "Equity Bank", w: "w-[100px]" },
                    { src: "/images/dfcu-logo.png", alt: "DFCU", w: "w-[100px]" },
                    { src: "/images/abc-logo.png", alt: "ABC Bank", w: "w-[100px]" },
                    { src: "/images/centenary-bank-logo.png", alt: "Centenary Bank", w: "w-[100px]" },
                    { src: "/images/boa-logo.svg", alt: "BOA", w: "w-[150px]", extra: "bg-black p-4 rounded-lg" },
                    { src: "/images/mtn-logo.svg", alt: "MTN", w: "w-[100px]" },
                    { src: "/images/airtel-logo.svg", alt: "Airtel", w: "w-[100px]" },
                  ].map((logo, i) => (
                    <div key={`${set}-${i}`} className={`flex-shrink-0 flex flex-col items-center justify-center ${logo.w} ${logo.extra || ""}`}>
                      <Image src={logo.src} alt={logo.alt} width={100} height={100} className="rounded-lg w-full h-auto max-h-[80px] object-contain" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          </div>  
        </div>
      </section>

      {/* Benefits When You Adopt */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-[#08163d] mb-12 text-center">
                Benefits When You Adopt
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Gem, title: "Increased Brand Visibility", desc: "Reach more customers across Uganda and East Africa with your branded payment experience. Stand out with a professional payment presence." },
                  { icon: Users, title: "Boosted Customer Involvement", desc: "Engage customers with seamless checkout flows. Accept MTN, Airtel, and bank transfers in one integration—increasing conversion and satisfaction." },
                  { icon: Wallet, title: "Global Payment Approval", desc: "Accept payments from customers worldwide. Our gateway supports multiple currencies and payment methods for cross-border transactions." },
                  { icon: Coins, title: "Lowered Operational Costs", desc: "Reduce integration and maintenance costs with a single API. No need to manage multiple payment provider contracts." },
                  { icon: Shield, title: "Security Conformity", desc: "PCI-compliant infrastructure with enterprise-grade security. Your customers' data and transactions are protected." },
                  { icon: DollarSign, title: "Revenue Opportunities", desc: "Offering white-label payment solutions can generate additional revenue from transaction fees, card issuance charges, and value-added solutions like cashback or rewards programs." },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group bg-white rounded-xl p-6 shadow-sm flex flex-col items-start cursor-default transition-all duration-300 hover:bg-[#08163d]"
                  >
                    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-white/20">
                      <item.icon className="w-6 h-6 text-[#08163d] transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-[#08163d] transition-colors duration-300 group-hover:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed opacity-0 max-h-0 overflow-hidden transition-all duration-300 ease-out group-hover:opacity-100 group-hover:max-h-48 group-hover:mt-3 group-hover:text-gray-200">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stats / By the numbers section - under Benefits */}
              <div className="mt-16">
                <h3 className="text-xl md:text-2xl font-bold text-[#08163d] mb-8 text-center">
                  By the Numbers
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Card 1 - Integration support + payment cards visual */}
                  <div className="bg-[#08163d] rounded-2xl p-6 flex flex-col min-h-[280px]">
                    <span className="text-4xl md:text-5xl font-bold text-white border-b-4 border-white/30 pb-2 inline-block">
                      1.2M+
                    </span>
                    <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                      Provide technical integration support for virtual and physical cards
                    </p>
                    <div className="mt-auto pt-6 flex justify-center">
                      <div className="relative h-14 w-24">
                        <div className="absolute bottom-0 left-0 w-20 h-12 rounded-md bg-white/20 border border-white/30 rotate-[-8deg]" />
                        <div className="absolute bottom-1 left-2 w-20 h-12 rounded-md bg-white/15 border border-white/20 rotate-[4deg]" />
                        <div className="absolute bottom-2 left-4 w-20 h-12 rounded-md bg-white/10 border border-white/10 rotate-[-4deg]" />
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - Authorizations + notification bubble */}
                  <div className="bg-[#08163d] rounded-2xl p-6 flex flex-col min-h-[280px] relative">
                    <div className="absolute top-4 left-4 right-4 bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-white">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>You have paid UGX 650,000 at Jumia using Mobile Money ending with *1234</span>
                    </div>
                    <span className="text-4xl md:text-5xl font-bold text-white border-b-4 border-white/30 pb-2 inline-block mt-14">
                      24M+
                    </span>
                    <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                      Authorizations processed by RukaPay
                    </p>
                  </div>

                  {/* Card 3 - Transactions + notification bubble */}
                  <div className="bg-[#08163d] rounded-2xl p-6 flex flex-col min-h-[280px] relative">
                    <div className="absolute top-4 left-4 right-4 bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-white">
                      <span className="font-semibold">MTN</span>
                      <span>-UGX 15,000</span>
                    </div>
                    <span className="text-4xl md:text-5xl font-bold text-white border-b-4 border-white/30 pb-2 inline-block mt-14">
                      70M+
                    </span>
                    <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                      Transactions processed in UGX
                    </p>
                  </div>
                </div>
              </div>
            </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#08163d] text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.jpg" alt="RukaPay" width={32} height={32} className="rounded-lg object-cover" />
              <span className="text-white font-bold text-lg">RukaPay</span>
            </div>
            <p className="text-sm text-center md:text-right">
              The payment gateway built for Africa. Powering businesses across East Africa.
            </p>
          </div>
          <div className="border-t border-white/20 pt-8 mt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} RukaPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
