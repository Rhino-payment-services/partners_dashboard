"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, KeyRound, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react'

export default function PublicHome() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      {/* Navbar */}
      <nav className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 h-16 bg-white/80 backdrop-blur-md shadow-md transition-all'>
        <div className='flex items-center gap-2'>
          <span className='font-bold text-xl text-[#08163d]'>RukaPay</span>
        </div>
        <div className='flex items-center gap-6'>
          <Link href='/' className='text-[#08163d] font-medium hover:underline'>Home</Link>
          <a href='#services' className='text-[#08163d] font-medium hover:underline'>Services</a>
          <Link href='/documentation' className='text-[#08163d] font-medium hover:underline'>Documentation</Link>
          <Link href='/login'>
            <Button className='flex items-center gap-2'>Login <ArrowRight size={16} /></Button>
          </Link>
        </div>
      </nav>
      {/* Hero Section */}
      <section className='flex flex-col md:flex-row items-center justify-center px-6 md:px-16 bg-gradient-to-b from-white to-blue-50 min-h-[calc(100vh-4rem)] pt-20'>
        {/* Left: Content */}
        <div className='flex-1 flex flex-col items-start justify-center max-w-xl w-full py-12 md:py-0'>
          <span className='inline-block bg-blue-100 text-blue-700 font-semibold rounded-full px-4 py-1 mb-4 text-sm shadow'>Powering Modern Payments in Africa</span>
          <h1 className='text-4xl md:text-5xl font-extrabold text-[#08163d] mb-4 drop-shadow-lg text-left'>
            Welcome to <span className='text-blue-600'>RukaPay</span> Partners
          </h1>
          <p className='text-lg text-gray-700 mb-6 max-w-2xl text-left'>
            Seamlessly collect payments, manage your transactions, and grow your business with <span className='font-semibold text-[#4F46E5]'>RukaPay’s secure and modern payment gateway</span> platform.
          </p>
          <Link href='/login'>
            <Button size='lg' className='text-lg px-8 py-4 flex items-center gap-2 shadow-lg hover:scale-105 transition-transform'>Get Started <ArrowRight size={20} /></Button>
          </Link>
          {/* Trust bar / testimonial */}
          <div className='mt-8 flex flex-col items-start'>
            <span className='text-xs text-gray-500 mb-2'>Trusted by leading businesses</span>
            <div className='flex gap-6 opacity-80'>
              <span className='font-bold text-[#08163d] text-sm'>PayFast</span>
              <span className='font-bold text-[#08163d] text-sm'>QuickShop</span>
              <span className='font-bold text-[#08163d] text-sm'>FinServe</span>
              <span className='font-bold text-[#08163d] text-sm'>MarketPro</span>
            </div>
          </div>
        </div>
        {/* Right: Graphics placeholder */}
        <div className='flex-1 flex items-center justify-center w-full h-full py-12 md:py-0'>
          {/* You can replace this with a custom SVG, illustration, or animation */}
          <div className='w-full max-w-md h-72 bg-blue-100 rounded-2xl flex items-center justify-center shadow-inner'>
            <span className='text-blue-400 font-bold text-2xl opacity-60'>[Your Graphic Here]</span>
          </div>
        </div>
      </section>
      {/* Partners Slider */}
      <section className='w-full bg-white py-6 border-y border-gray-100'>
        <div className='max-w-6xl mx-auto overflow-hidden'>
          <div className='flex items-center gap-12 animate-marquee whitespace-nowrap'>
            {/* Replace these with actual partner logos as needed */}
            <span className='inline-block text-[#08163d] font-bold text-lg opacity-80'>
              <img src='/partners/payfast.svg' alt='PayFast' className='h-10 w-auto inline-block mr-4' />PayFast
            </span>
            <span className='inline-block text-[#08163d] font-bold text-lg opacity-80'>
              <img src='/partners/quickshop.svg' alt='QuickShop' className='h-10 w-auto inline-block mr-4' />QuickShop
            </span>
            <span className='inline-block text-[#08163d] font-bold text-lg opacity-80'>
              <img src='/images/fintech.jpg' alt='FinServe' className='h-10 w-auto inline-block mr-4' />FinServe
            </span>
            <span className='inline-block text-[#08163d] font-bold text-lg opacity-80'>
              <img src='/images/marketpro.jpg' alt='MarketPro' className='h-10 w-auto inline-block mr-4' />MarketPro
            </span>
            <span className='inline-block text-[#08163d] font-bold text-lg opacity-80'>
              <img src='/images/africommerce.jpg' alt='Africommerce' className='h-10 w-auto inline-block mr-4' />Africommerce
            </span>
            <span className='inline-block text-[#08163d] font-bold text-lg opacity-80'>
              <img src='/partners/techhub.svg' alt='TechHub' className='h-10 w-auto inline-block mr-4' />TechHub
            </span>
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </section>
      {/* Services Section */}
      <section id='services' className='py-16 bg-white'>
        <div className='max-w-5xl mx-auto px-4'>
          <h2 className='text-3xl font-bold text-[#08163d] text-center mb-10'>Our Services</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            <div className='bg-blue-50 rounded-xl p-6 flex flex-col items-center shadow min-h-[300px]'>
              <CreditCard className='text-blue-600 mb-4' size={40} />
              <h3 className='font-semibold text-xl text-[#08163d] mb-3'>Collections</h3>
              <p className='text-gray-600 text-base text-center mb-2'>Collect payments from Mobile Money, Bank, and RukaPay accounts with ease.</p>
              <p className='text-gray-500 text-sm text-center'>Accept payments instantly from your customers, track all incoming funds in real time, and enjoy seamless reconciliation for your business.</p>
            </div>
            <div className='bg-green-50 rounded-xl p-6 flex flex-col items-center shadow min-h-[300px]'>
              <KeyRound className='text-green-600 mb-4' size={40} />
              <h3 className='font-semibold text-xl text-[#08163d] mb-3'>API Integration</h3>
              <p className='text-gray-600 text-base text-center mb-2'>Integrate our powerful API to automate your payment flows and reporting.</p>
              <p className='text-gray-500 text-sm text-center'>Connect RukaPay to your website, app, or ERP. Automate collections, payouts, and get instant notifications for every transaction.</p>
            </div>
            <div className='bg-yellow-50 rounded-xl p-6 flex flex-col items-center shadow min-h-[300px]'>
              <ShieldCheck className='text-yellow-600 mb-4' size={40} />
              <h3 className='font-semibold text-xl text-[#08163d] mb-3'>Security</h3>
              <p className='text-gray-600 text-base text-center mb-2'>Your data and transactions are protected with industry-leading security standards.</p>
              <p className='text-gray-500 text-sm text-center'>We use advanced encryption, fraud detection, and compliance tools to keep your business and your customers safe at all times.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className='py-6 text-center text-xs text-gray-400 bg-gray-100'>
        &copy; {new Date().getFullYear()} RukaPay. All rights reserved.
      </footer>
    </div>
  )
} 