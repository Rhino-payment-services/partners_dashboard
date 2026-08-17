"use client"
import React, { useEffect, useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from './ui/sidebar'
import {
  LayoutDashboard,
  Activity,
  Settings,
  LogOut,
  KeyRound,
  BookOpen,
  Users,
  RotateCcw,
  Store,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getPartnerProfile } from '@/lib/api'

type NavigationItem = {
  label: string
  href: string
  icon: LucideIcon
  permission?: string
}

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    label: 'Transactions',
    href: '/dashboard/transactions',
    icon: Activity,
    permission: 'canViewTransactions',
  },
  {
    label: 'Reversals',
    href: '/dashboard/reversals',
    icon: RotateCcw,
    permission: 'canViewTransactions',
  },
  {
    label: 'API Keys',
    href: '/dashboard/api-keys',
    icon: KeyRound,
    permission: 'canManageApiKeys',
  },
  {
    label: 'Members',
    href: '/dashboard/members',
    icon: Users,
    permission: 'canManageMembers',
  },
  {
    label: 'Merchants',
    href: '/dashboard/merchants',
    icon: Store,
  },
]

const supportItems: NavigationItem[] = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  {
    label: 'Documentation',
    href: '/dashboard/documentation',
    icon: BookOpen,
  },
]

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
    
    if (pathname === href || pathname === href + '/') return true
    return href !== '/dashboard' && pathname.startsWith(href + '/')
  }

  const renderItems = (items: NavigationItem[]) =>
    items
      .filter((item) => !item.permission || permissions?.[item.permission])
      .map(({ label, href, icon: Icon }) => {
        const active = isActivePath(href)
        return (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton
              asChild
              isActive={active}
              tooltip={label}
              className={`h-9 rounded-lg px-3 text-[13px] font-medium transition-all ${
                active
                  ? 'bg-[#eef2ff] text-[#08163d] shadow-sm ring-1 ring-[#dfe5f4] hover:bg-[#e8edfb] hover:text-[#08163d]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#08163d]'
              }`}
            >
              <Link href={href} className="flex items-center gap-3">
                <Icon size={16} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/80 bg-[#fbfbfc]">
      <SidebarHeader className="h-16 justify-center border-b border-slate-200/80 bg-[#fbfbfc] px-4">
        <div className="flex items-center gap-2.5">
          <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-slate-200/80">
            <Image
              src="/images/logo.png"
              alt="RukaPay"
              fill
              sizes="32px"
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div className="grid leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight text-[#08163d]">RukaPay</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Partner portal
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#fbfbfc] px-2 py-4">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="h-7 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 group-data-[collapsible=icon]:hidden">
            General
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {renderItems(navigationItems)}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200/80 bg-[#fbfbfc] p-2">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="h-7 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 group-data-[collapsible=icon]:hidden">
            Support
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {renderItems(supportItems)}
          </SidebarMenu>
        </SidebarGroup>
        <div className="my-2 h-px bg-slate-200/80" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              className="h-9 rounded-lg px-3 text-[13px] font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
              onClick={() => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')
                window.location.href = '/auth/login'
              }}
            >
              <LogOut size={16} strokeWidth={1.8} />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SideBar
