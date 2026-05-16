"use client"
import React, { useEffect, useState } from 'react'
import {
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
  Activity,
  Settings,
  LogOut,
  KeyRound,
  BookOpen,
  Users,
  CreditCard,
  RotateCcw
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getPartnerProfile } from '@/lib/api'

function SideBar() {
  const [permissions, setPermissions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname() || '/'

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const profile = await getPartnerProfile()
        setPermissions(profile.permissions || {
          canViewTransactions: true,
          canManageApiKeys: true,
          canViewAnalytics: true,
          canManageMembers: true,
          canConfigureTariffs: true,
        })
      } catch (error) {
        console.error('Failed to load permissions', error)
        setPermissions({
          canViewTransactions: false,
          canManageApiKeys: false,
          canViewAnalytics: false,
          canManageMembers: false,
          canConfigureTariffs: false,
        })
      } finally {
        setLoading(false)
      }
    }

    loadPermissions()
  }, [])

  if (loading) {
    return null // Don't show sidebar while loading permissions
  }

  const isActivePath = (href: string) => {
    if (!href) return false
    if (href === '/') return pathname === '/'
    
    // Exact match or match with trailing slash
    if (pathname === href || pathname === href + '/') return true
    
    // For documentation section, also match subpages (rukapay, mobile-money, etc.)
    if (href === '/dashboard/documentation' && pathname.startsWith(href + '/')) {
      return true
    }
    
    return false
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-none">
        <SidebarHeader className="flex py-4 px-4 md:px-8 h-16 bg-[#08163d] text-white border-b border-white gap-2">
          <div className='flex items-center gap-2'>
            <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center">
              <CreditCard className="text-[#08163d]" size={20} />
            </div>
            <span className='text-white text-base md:text-lg font-bold'>RukaPay</span>
          </div>
        </SidebarHeader>
          <SidebarContent className="flex-1 px-2 md:px-4 text-[#08163d] bg-white py-5">
          <SidebarMenu>
            <SidebarMenuItem className="mb-3 last:mb-0">
              <SidebarMenuButton asChild className={`flex items-center gap-2 md:gap-3 py-3 md:py-4 h-auto px-2 md:px-4 rounded-lg transition-colors ${isActivePath('/dashboard') ? 'bg-[#08163d] text-white hover:bg-[#08163d] hover:text-white' : 'text-[#08163d] hover:bg-[#08163d] hover:text-white cursor-pointer'}`}>
                <Link href="/dashboard" className="flex items-center gap-2 md:gap-3 w-full">
                  <LayoutDashboard className="mr-1 md:mr-2" size={18} />
                  <span className="font-regular text-current text-sm md:text-base lg:text-[18px]">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {permissions?.canViewTransactions && (
              <SidebarMenuItem className="mb-3 last:mb-0">
                <SidebarMenuButton asChild className={`flex items-center gap-2 md:gap-3 py-3 md:py-4 h-auto px-2 md:px-4 rounded-lg transition-colors ${isActivePath('/dashboard/transactions') ? 'bg-[#08163d] text-white hover:bg-[#08163d] hover:text-white' : 'text-[#08163d] hover:bg-[#08163d] hover:text-white cursor-pointer'}`}>
                  <Link href="/dashboard/transactions" className="flex items-center gap-2 md:gap-3 w-full">
                    <Activity className="mr-1 md:mr-2" size={18} />
                    <span className="font-regular text-current text-sm md:text-base lg:text-[18px]">Transactions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {permissions?.canViewTransactions && (
              <SidebarMenuItem className="mb-3 last:mb-0">
                <SidebarMenuButton asChild className={`flex items-center gap-2 md:gap-3 py-3 md:py-4 h-auto px-2 md:px-4 rounded-lg transition-colors ${isActivePath('/dashboard/reversals') ? 'bg-[#08163d] text-white hover:bg-[#08163d] hover:text-white' : 'text-[#08163d] hover:bg-[#08163d] hover:text-white cursor-pointer'}`}>
                  <Link href="/dashboard/reversals" className="flex items-center gap-2 md:gap-3 w-full">
                    <RotateCcw className="mr-1 md:mr-2" size={18} />
                    <span className="font-regular text-current text-sm md:text-base lg:text-[18px]">Reversals</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {permissions?.canManageApiKeys && (
              <SidebarMenuItem className="mb-3 last:mb-0">
                <SidebarMenuButton asChild className={`flex items-center gap-2 md:gap-3 py-3 md:py-4 h-auto px-2 md:px-4 rounded-lg transition-colors ${isActivePath('/dashboard/api-keys') ? 'bg-[#08163d] text-white hover:bg-[#08163d] hover:text-white' : 'text-[#08163d] hover:bg-[#08163d] hover:text-white cursor-pointer'}`}>
                  <Link href="/dashboard/api-keys" className="flex items-center gap-2 md:gap-3 w-full">
                    <KeyRound className="mr-1 md:mr-2" size={18} />
                    <span className="font-regular text-current text-sm md:text-base lg:text-[18px]">API Keys</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {permissions?.canManageMembers && (
              <SidebarMenuItem className="mb-3 last:mb-0">
                <SidebarMenuButton asChild className={`flex items-center gap-2 md:gap-3 py-3 md:py-4 h-auto px-2 md:px-4 rounded-lg transition-colors ${isActivePath('/dashboard/members') ? 'bg-[#08163d] text-white hover:bg-[#08163d] hover:text-white' : 'text-[#08163d] hover:bg-[#08163d] hover:text-white cursor-pointer'}`}>
                  <Link href="/dashboard/members" className="flex items-center gap-2 md:gap-3 w-full">
                    <Users className="mr-1 md:mr-2" size={18} />
                    <span className="font-regular text-current text-sm md:text-base lg:text-[18px]">Members</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem className="mb-3 last:mb-0">
              <SidebarMenuButton asChild className={`flex items-center gap-2 md:gap-3 py-3 md:py-4 h-auto px-2 md:px-4 rounded-lg transition-colors ${isActivePath('/dashboard/settings') ? 'bg-[#08163d] text-white hover:bg-[#08163d] hover:text-white' : 'text-[#08163d] hover:bg-[#08163d] hover:text-white cursor-pointer'}`}>
                <Link href="/dashboard/settings" className="flex items-center gap-2 md:gap-3 w-full">
                  <Settings className="mr-1 md:mr-2" size={18} />
                  <span className='font-regular text-current text-sm md:text-base lg:text-[18px]'>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Documentation */}
            <SidebarMenuItem className="mb-3 last:mb-0">
              <SidebarMenuButton asChild className={`flex items-center gap-2 md:gap-3 py-3 md:py-4 h-auto px-2 md:px-4 rounded-lg transition-colors ${isActivePath('/dashboard/documentation') ? 'bg-[#08163d] text-white hover:bg-[#08163d] hover:text-white' : 'text-[#08163d] hover:bg-[#08163d] hover:text-white cursor-pointer'}`}>
                <Link href="/dashboard/documentation" className="flex items-center gap-2 md:gap-3 w-full">
                  <BookOpen className="mr-1 md:mr-2" size={18} />
                  <span className="font-regular text-current text-sm md:text-base lg:text-[18px]">Documentation</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter className="px-2 md:px-4 pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="flex items-center gap-2 md:gap-3 py-3 px-2 md:px-4 rounded-lg transition-colors hover:bg-[#08163d] hover:text-white cursor-pointer"
                onClick={() => {
                  localStorage.removeItem('accessToken')
                  localStorage.removeItem('refreshToken')
                  localStorage.removeItem('user')
                  window.location.href = '/auth/login'
                }}
              >
                <LogOut className="mr-1 md:mr-2" size={18} />
                  <span className="font-regular text-sm md:text-base lg:text-[18px]">Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
  )
}

export default SideBar
