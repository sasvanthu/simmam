import { Bell, Search, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth'

import AdminMobileNav from './AdminMobileNav'

export default function AdminHeader() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/20 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <AdminMobileNav />

          <div>
            <h2 className="font-display text-2xl text-white">
              Admin Dashboard
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="glass flex h-11 w-11 items-center justify-center rounded-2xl">
            <Search className="h-5 w-5 text-white" />
          </button>

          <button className="glass flex h-11 w-11 items-center justify-center rounded-2xl">
            <Bell className="h-5 w-5 text-white" />
          </button>

          {user && (
            <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
              </div>
              <button
                onClick={logout}
                className="glass flex h-11 w-11 items-center justify-center rounded-2xl hover:bg-red-500/10 hover:border-red-500/20"
              >
                <LogOut className="h-5 w-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}