import {
  LayoutDashboard,
  CalendarDays,
  Trophy,
  Shield,
  Users,
  Megaphone,
  Settings,
  CheckCircle,
  UserCog,
} from 'lucide-react'

import { Link } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'

const MENU_ITEMS = {
  all: [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
  ],
  coordinator: [
    {
      title: 'Events',
      href: '/admin/events',
      icon: CalendarDays,
    },
    {
      title: 'Participants',
      href: '/admin/participants',
      icon: Users,
    },
    {
      title: 'Check-In',
      href: '/admin/checkin',
      icon: CheckCircle,
    },
  ],
  reg_team: [
    {
      title: 'Events',
      href: '/admin/events',
      icon: CalendarDays,
    },
    {
      title: 'Participants',
      href: '/admin/participants',
      icon: Users,
    },
    {
      title: 'Check-In',
      href: '/admin/checkin',
      icon: CheckCircle,
    },
  ],
  developer_admin: [
    {
      title: 'Events',
      href: '/admin/events',
      icon: CalendarDays,
    },
    {
      title: 'Leaderboard',
      href: '/admin/leaderboard',
      icon: Trophy,
    },
    {
      title: 'Houses',
      href: '/admin/houses',
      icon: Shield,
    },
    {
      title: 'Participants',
      href: '/admin/participants',
      icon: Users,
    },
    {
      title: 'Check-In',
      href: '/admin/checkin',
      icon: CheckCircle,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: UserCog,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ],
}

export default function AdminSidebar() {
  const { user, logout } = useAuth()

  if (!user) return null

  const getMenuItems = () => {
    const baseItems = MENU_ITEMS.all
    const roleItems = MENU_ITEMS[user.role] || []
    return [...baseItems, ...roleItems]
  }

  const menuItems = getMenuItems()

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-black/30 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="border-b border-white/10 p-6">
        <h1 className="font-display text-3xl font-bold text-yellow-400">
          SIMMAM
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Admin Control Center
        </p>

        <div className="mt-4 rounded-lg bg-white/5 p-3">
          <p className="text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
          {user.assignedEvent && (
            <p className="text-xs text-yellow-400 mt-1">Event: {user.assignedEvent}</p>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.title}
              to={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-white"
              activeProps={{
                className:
                  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
              }}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  )
}