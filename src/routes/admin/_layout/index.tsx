import { createFileRoute } from '@tanstack/react-router'
import {
  CalendarDays,
  Trophy,
  Users,
  Shield,
  Activity,
  UserCheck
} from 'lucide-react'

import StatCard from '@/components/admin/dashboard/StatCard'
import PageHeader from '@/components/admin/shared/PageHeader'
import { useData } from '@/lib/store'
import { useMemo } from 'react'

export const Route = createFileRoute('/admin/_layout/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { events, participants, houses } = useData()

  const stats = useMemo(() => {
    const totalEvents = events.length
    const totalParticipants = participants.length
    const totalHouses = houses.length
    const checkedIn = participants.filter(p => p.checkIn).length
    const liveEvents = events.filter(e => e.status === 'ongoing').length

    return {
      totalEvents,
      totalParticipants,
      totalHouses,
      checkedIn,
      liveEvents
    }
  }, [events, participants, houses])

  const topHouses = useMemo(() => {
    return [...houses].sort((a, b) => b.points2025 - a.points2025).slice(0, 3)
  }, [houses])

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="SIMMAM Command Center"
        subtitle="Monitor events, leaderboard, houses, and live festival operations"
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Events"
          value={stats.totalEvents.toString()}
          icon={CalendarDays}
          accent="gold"
        />

        <StatCard
          title="Total Participants"
          value={stats.totalParticipants.toString()}
          icon={Users}
          accent="red"
        />

        <StatCard
          title="Checked In"
          value={stats.checkedIn.toString()}
          icon={UserCheck}
          accent="gold"
        />

        <StatCard
          title="Live Events"
          value={stats.liveEvents.toString()}
          icon={Activity}
          accent="red"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-strong rounded-3xl p-8 lg:col-span-2 border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 blur-[100px] opacity-10 bg-gold pointer-events-none group-hover:opacity-20 transition-opacity" />
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl text-white font-bold tracking-tight">
              Operational Overview
            </h2>
            <div className="text-[10px] uppercase tracking-widest text-gold font-bold px-3 py-1 bg-gold/10 rounded-full">
              Live Updates
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 border border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Check-in Completion</div>
                <div className="text-2xl font-black text-white">
                  {Math.round((stats.checkedIn / stats.totalParticipants) * 100) || 0}%
                </div>
              </div>
              <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-crimson to-gold shadow-[0_0_10px_rgba(255,107,0,0.5)]" 
                  style={{ width: `${(stats.checkedIn / stats.totalParticipants) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-6 border border-white/5">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Upcoming Finals</div>
                <div className="text-xl font-bold text-white">4 Stages</div>
              </div>
              <div className="glass rounded-2xl p-6 border border-white/5">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Team Capacity</div>
                <div className="text-xl font-bold text-white">88%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 blur-[100px] opacity-10 bg-red-500 pointer-events-none group-hover:opacity-20 transition-opacity" />
          
          <h2 className="font-display text-2xl text-white font-bold tracking-tight mb-8">
            Standings Preview
          </h2>

          <div className="space-y-4">
            {topHouses.map((house, index) => (
              <div 
                key={house.name}
                className="flex items-center justify-between rounded-2xl bg-white/5 px-5 py-4 border border-white/5 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white" style={{ background: house.gradient }}>
                    {index + 1}
                  </div>
                  <span className="text-white font-bold">{house.name}</span>
                </div>
                <span className="font-black text-gold tracking-tight">{house.points2025.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 hover:text-white transition-all">
            View Full Leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}