import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
import AccessDenied from '@/components/admin/shared/AccessDenied'
import PageHeader from '@/components/admin/shared/PageHeader'
import { useState } from 'react'
import { 
  Settings2, 
  ShieldCheck, 
  Users2, 
  BellRing, 
  Globe, 
  Lock,
  Save,
  AlertTriangle
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_layout/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { hasPermission } = useAuth()
  const { settings, updateSettings, events } = useData()
  const [localSettings, setLocalSettings] = useState(settings)

  if (!hasPermission('settings', 'read')) {
    return <AccessDenied />
  }

  const handleSave = () => {
    updateSettings(localSettings)
    toast.success('System settings updated successfully')
  }

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <PageHeader
        title="System Settings"
        subtitle="Configure festival status, registrations, and coordinator roles"
      />

      <div className="grid gap-6">
        {/* Festival Configuration */}
        <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <div className="p-3 rounded-2xl bg-gold/10 text-gold">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Festival Control</h3>
              <p className="text-xs text-muted-foreground">Global status and public visibility</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-bold text-white/80">Festival Status</Label>
                <Select 
                  value={localSettings.festivalStatus} 
                  onValueChange={(val: any) => setLocalSettings({...localSettings, festivalStatus: val})}
                >
                  <SelectTrigger className="glass h-12 border-white/10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/10">
                    <SelectItem value="pre">Pre-Festival (Coming Soon)</SelectItem>
                    <SelectItem value="live">Live Now (Show Leaderboard)</SelectItem>
                    <SelectItem value="post">Post-Festival (Results View)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Changing status affects the frontend hero section and leaderboard visibility.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5">
                <div className="space-y-1">
                  <Label className="text-white font-bold">Public Registrations</Label>
                  <p className="text-[10px] text-muted-foreground">Toggle new participant signups</p>
                </div>
                <Switch 
                  checked={localSettings.registrationsOpen} 
                  onCheckedChange={(val) => setLocalSettings({...localSettings, registrationsOpen: val})}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/10 space-y-4">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest">
                  <AlertTriangle className="w-4 h-4" />
                  Danger Zone
                </div>
                <p className="text-xs text-muted-foreground">
                  Resetting data will clear all participants and point adjustments. This cannot be undone.
                </p>
                <Button variant="outline" className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400">
                  Reset All System Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Access Management */}
        <div className="glass-strong rounded-3xl p-8 border border-white/5 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <div className="p-3 rounded-2xl bg-gold/10 text-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Coordinator Assignments</h3>
              <p className="text-xs text-muted-foreground">Assign coordinators to specific events</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 space-y-2 w-full">
                  <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Select Coordinator</Label>
                  <Select>
                    <SelectTrigger className="glass h-12 border-white/10">
                      <SelectValue placeholder="Select staff/student..." />
                    </SelectTrigger>
                    <SelectContent className="glass-strong border-white/10">
                      <SelectItem value="1">Shaik Abdul Hussain</SelectItem>
                      <SelectItem value="2">Libhika</SelectItem>
                      <SelectItem value="3">Nithish Kumar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Assign Event</Label>
                  <Select>
                    <SelectTrigger className="glass h-12 border-white/10">
                      <SelectValue placeholder="Choose event..." />
                    </SelectTrigger>
                    <SelectContent className="glass-strong border-white/10 max-h-[200px]">
                      {events.slice(0, 10).map(e => (
                        <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-white text-black font-bold h-12 px-8 rounded-xl w-full md:w-auto">
                  Assign
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">Active Assignments</h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name: 'Shaik Abdul', event: 'Basketball' },
                  { name: 'Libhika', event: 'Volleyball' },
                  { name: 'Nithish Kumar', event: 'Tennis' }
                ].map((item, i) => (
                  <div key={i} className="glass rounded-xl p-4 flex items-center justify-between border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-gold font-medium uppercase tracking-tighter">{item.event}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-400">
                      <Lock className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-[var(--crimson)] to-[var(--gold)] text-background font-black text-sm uppercase tracking-widest px-12 py-7 rounded-2xl shadow-[var(--shadow-glow-red)] hover:scale-105 transition-all"
          >
            <Save className="w-5 h-5 mr-3" />
            Save All Configurations
          </Button>
        </div>
      </div>
    </div>
  )
}
