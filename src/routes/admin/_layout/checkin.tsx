import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useData, Participant } from '@/lib/store'
import AccessDenied from '@/components/admin/shared/AccessDenied'
import PageHeader from '@/components/admin/shared/PageHeader'
import { useState, useEffect } from 'react'
import { 
  Search, 
  Scan, 
  CheckCircle2, 
  Undo2, 
  Users, 
  UserCheck,
  Calendar
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_layout/checkin')({
  component: CheckInPage,
})

function CheckInPage() {
  const { hasPermission } = useAuth()
  const { participants, updateParticipant } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [recentCheckIns, setRecentCheckIns] = useState<Participant[]>([])

  if (!hasPermission('checkin', 'create')) {
    return <AccessDenied />
  }

  const results = searchQuery.length >= 3 
    ? participants.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.regNo.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const handleCheckIn = (p: Participant) => {
    updateParticipant({ ...p, checkIn: true })
    setRecentCheckIns(prev => [p, ...prev.filter(item => item.id !== p.id)].slice(0, 5))
    setSearchQuery('')
    toast.success(`${p.name} checked in successfully`)
  }

  const handleUndo = (p: Participant) => {
    updateParticipant({ ...p, checkIn: false })
    setRecentCheckIns(prev => prev.filter(item => item.id !== p.id))
    toast.info(`Check-in undone for ${p.name}`)
  }

  const checkedInCount = participants.filter(p => p.checkIn).length
  const totalCount = participants.length

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <PageHeader
        title="Quick Check-In"
        subtitle="Fast attendance tracking for event coordinators"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-strong rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Scan className="w-32 h-32 text-gold" />
            </div>
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl bg-gold/10 text-gold">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Search Participant</h3>
              </div>

              <div className="space-y-4">
                <Input
                  autoFocus
                  placeholder="Enter Name or Reg No (min 3 chars)..."
                  className="h-16 text-xl glass border-white/10 rounded-2xl px-6 focus:border-gold/50 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <div className="space-y-3">
                  {results.length > 0 ? (
                    results.map(p => (
                      <div 
                        key={p.id}
                        className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5 hover:border-gold/30 transition-all"
                      >
                        <div>
                          <div className="font-bold text-lg text-white">{p.name}</div>
                          <div className="text-sm text-muted-foreground">{p.regNo} • {p.event}</div>
                        </div>
                        {p.checkIn ? (
                          <div className="flex items-center gap-2 text-green-400 font-bold px-4 py-2 bg-green-500/10 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" />
                            Checked In
                          </div>
                        ) : (
                          <Button 
                            className="bg-gold text-background font-bold hover:bg-gold/90 rounded-xl px-6 py-6"
                            onClick={() => handleCheckIn(p)}
                          >
                            Check In
                          </Button>
                        )}
                      </div>
                    ))
                  ) : searchQuery.length >= 3 ? (
                    <div className="text-center py-8 text-muted-foreground">No participants found</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {recentCheckIns.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-4">Recently Checked In</h4>
              <div className="space-y-2">
                {recentCheckIns.map(p => (
                  <div key={p.id} className="glass rounded-2xl p-4 flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground">{p.event}</div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg"
                      onClick={() => handleUndo(p)}
                    >
                      <Undo2 className="w-4 h-4 mr-2" />
                      Undo
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-strong rounded-3xl p-6 border border-white/5">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Attendance Stats</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Total Checked-In</span>
                  <span className="text-white font-bold">{checkedInCount} / {totalCount}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-500" 
                    style={{ width: `${(checkedInCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <Users className="w-4 h-4 text-gold mb-2" />
                  <div className="text-2xl font-black text-white">{totalCount}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-tighter">Total Registered</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <Calendar className="w-4 h-4 text-gold mb-2" />
                  <div className="text-2xl font-black text-white">{checkedInCount}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-tighter">Present Today</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border border-dashed border-white/10">
            <h5 className="text-xs font-bold text-white mb-2">Pro Tip:</h5>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Use a barcode scanner to speed up check-ins. The search field automatically focuses after each check-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}