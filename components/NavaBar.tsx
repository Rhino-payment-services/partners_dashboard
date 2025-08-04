import React from 'react'
import { Bell, HelpCircle, Settings, Search } from 'lucide-react'

function NavaBar() {
  return (
    <nav className='h-16 bg-white flex items-center justify-between px-8 shadow-sm sticky top-0 z-50'>
      {/* Left: Search */}
      <div className='flex items-center gap-2'>
        <div className='relative'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
            <Search size={18} />
          </span>
          <input
            type='text'
            placeholder='Search...'
            className='pl-10 pr-3 py-2 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#08163d] transition w-72'
          />
        </div>
      </div>
      {/* Right: Support, Notification, Settings, Avatar */}
      <div className='flex items-center gap-4'>
        {/* Support */}
        <button className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'>
          <HelpCircle className='text-[#08163d]' size={22} />
        </button>
        {/* Notification */}
        <button className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'>
          <Bell className='text-[#08163d]' size={22} />
        </button>
        {/* Settings */}
        <button className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'>
          <Settings className='text-[#08163d]' size={22} />
        </button>
        {/* Profile Avatar */}
        <div className='w-9 h-9 rounded-full bg-[#08163d] flex items-center justify-center text-white font-semibold text-lg cursor-pointer'>
          RP
        </div>
      </div>
    </nav>
  )
}

export default NavaBar