"use client"
import React from 'react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator
} from './ui/sidebar'
import {
  LayoutDashboard,
  FileText,
  Activity,
  Send,
  CreditCard,
  LifeBuoy,
  Settings,
  LogOut,
  KeyRound,
  BarChart2,
  Wallet,
  Users,
  ShoppingCart,
  BookOpen,
  ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

function SideBar() {
  const [showDocsDropdown, setShowDocsDropdown] = useState(false)

  return (
    <SidebarProvider className='w-full '>
      <Sidebar className="w-1/6  border-none">
        <SidebarHeader className="flex py-4 px-8 h-16 bg-[#08163d] text-white border-b border-white gap-2">
          <span className="font-bold text-lg flex gap-2">
            <LayoutDashboard className="text-white" size={28} />
            <span className='text-[#08163d ] text-[18px]'>
              RukaPay
            </span>
          </span>
        </SidebarHeader>
          <SidebarContent className="flex-1 px-4 text-[#08163d] bg-white py-5">
          <SidebarMenu>
            <SidebarMenuItem className="mb-3 last:mb-0">
              <Link href="/" passHref legacyBehavior>
                <SidebarMenuButton asChild className="flex items-center gap-3 py-4 h-10 px-4 rounded-lg transition-colors hover:bg-blue-600">
                  <a>
                    <LayoutDashboard className="mr-2" />
                    <span className="font-regular text-[#08163d] text-[18px]">Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="mb-3 last:mb-0">
              <Link href="/collections" passHref legacyBehavior>
                <SidebarMenuButton asChild className="flex items-center gap-3 py-4 h-10 px-4 rounded-lg transition-colors hover:bg-blue-600">
                  <a>
                    <Wallet className="mr-2" />
                    <span className="font-regular text-[#08163d] text-[18px]">Collections</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="mb-3 last:mb-0">
              <Link href="/transactions" passHref legacyBehavior>
                <SidebarMenuButton asChild className="flex items-center gap-3 py-4 h-10 px-4 rounded-lg transition-colors hover:bg-blue-600">
                  <a>
                    <Activity className="mr-2" />
                    <span className="font-regular text-[#08163d] text-[18px]">Transactions</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="mb-3 last:mb-0">
              <Link href="/withdraw" passHref legacyBehavior>
                <SidebarMenuButton asChild className="flex items-center gap-3 py-4 h-10 px-4 rounded-lg transition-colors hover:bg-blue-600">
                  <a>
                    <Send className="mr-2" />
                    <span className="font-regular text-[#08163d] text-[18px]">Withdrawals</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="mb-3 last:mb-0">
              <Link href="/invoices" passHref legacyBehavior>
                <SidebarMenuButton asChild className="flex items-center gap-3 py-4 h-10 px-4 rounded-lg transition-colors hover:bg-blue-600">
                  <a>
                    <FileText className="mr-2" />
                    <span className="font-regular text-[#08163d] text-[18px]">Invoices</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="mb-3 last:mb-0">
              <Link href="/api-keys" passHref legacyBehavior>
                <SidebarMenuButton asChild className="flex items-center gap-3 py-4 h-10 px-4 rounded-lg transition-colors hover:bg-blue-600">
                  <a>
                    <KeyRound className="mr-2" />
                    <span className="font-regular text-[#08163d] text-[18px]">API Keys</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="mb-3 last:mb-0">
              <Link href="/reports" passHref legacyBehavior>
                <SidebarMenuButton asChild className="flex items-center gap-3 py-4 h-10 px-4 rounded-lg transition-colors hover:bg-blue-600">
                  <a>
                    <BarChart2 className="mr-2" />
                    <span className="font-regular text-[#08163d] text-[18px]">Reports</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="mb-3 last:mb-0">
              <Link href="/settings" passHref legacyBehavior>
                <SidebarMenuButton asChild className="flex items-center gap-3 py-4 h-10 px-4 rounded-lg transition-colors hover:bg-blue-600">
                  <a>
                    <Settings className="mr-2" />
                    <span className='font-regular text-[#08163d] text-[18px]'>Settings</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="mb-3 last:mb-0">
              <Link href="/support" passHref legacyBehavior>
                <SidebarMenuButton asChild className="flex items-center gap-3 py-4 h-10 px-4 rounded-lg transition-colors hover:bg-blue-600">
                  <a>
                    <LifeBuoy className="mr-2" />
                    <span className="font-regular text-[#08163d] text-[18px]">Support</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {/* Documentation Dropdown */}
            <SidebarMenuItem className="mb-3 last:mb-0">
              <div>
                <button
                  className="flex items-center gap-3 py-4 h-10 px-4 rounded-lg w-full transition-colors hover:bg-blue-600 text-left"
                  onClick={() => setShowDocsDropdown?.((prev: boolean) => !prev)}
                  type="button"
                >
                  <BookOpen className="mr-2" />
                  <span className="font-regular text-[#08163d] text-[18px] flex-1">Documentation</span>
                  <ChevronDown className="ml-auto" size={18} />
                </button>
                {showDocsDropdown && (
                  <div className="ml-8 mt-2 flex flex-col gap-1">
                    <Link href="/documentation/mobile-money" passHref legacyBehavior>
                      <a className="block py-2 px-2 rounded hover:bg-blue-100 text-[#08163d] text-[16px]">*Mobile Money</a>
                    </Link>
                    <Link href="/documentation/rukapay" passHref legacyBehavior>
                      <a className="block py-2 px-2 rounded hover:bg-blue-100 text-[#08163d] text-[16px]">* RukaPay</a>
                    </Link>
                    <Link href="/documentation/bank" passHref legacyBehavior>
                      <a className="block py-2 px-2 rounded hover:bg-blue-100 text-[#08163d] text-[16px]">* Bank</a>
                    </Link>
                    <Link href="/documentation/transaction-status" passHref legacyBehavior>
                      <a className="block py-2 px-2 rounded hover:bg-blue-100 text-[#08163d] text-[16px]">* Status</a>
                    </Link>
                    <Link href="/documentation/webhook" passHref legacyBehavior>
                      <a className="block py-2 px-2 rounded hover:bg-blue-100 text-[#08163d] text-[16px]">* Webhook</a>
                    </Link>
                  </div>
                )}
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter className="px-4 pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-3 py-3 px-4 rounded-lg transition-colors hover:bg-blue-600">
                <LogOut className="mr-2" />
                  <span className="font-regular text-[#08163d] text-[18px]">Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}

export default SideBar