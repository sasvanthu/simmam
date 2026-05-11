import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
import AccessDenied from '@/components/admin/shared/AccessDenied'
import PageHeader from '@/components/admin/shared/PageHeader'
import { useState } from 'react'
import { Edit2, User, Users, Shield, Palette } from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { type House } from '@/lib/houses'

export const Route = createFileRoute('/admin/_layout/houses')({
  component: HousesManagement,
})

function HousesManagement() {
  const { hasPermission } = useAuth()
  const { houses, updateHouse } = useData()
  const [editingHouse, setEditingHouse] = useState<House | null>(null)

  if (!hasPermission('houses', 'read')) {
    return <AccessDenied />
  }

  const handleUpdateHouse = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingHouse) {
      updateHouse(editingHouse)
      setEditingHouse(null)
      toast.success(`${editingHouse.name} metadata updated`)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="House Management"
        subtitle="Manage house details, captains, and aesthetics"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {houses.map((house) => (
          <div 
            key={house.name}
            className="glass-strong rounded-3xl p-8 relative overflow-hidden group border border-white/5"
          >
            {/* Background Glow */}
            <div 
              className="absolute -right-20 -top-20 w-64 h-64 blur-[100px] opacity-20 transition-opacity group-hover:opacity-40"
              style={{ backgroundColor: house.accent }}
            />

            <div className="flex flex-col md:flex-row gap-8 items-start relative">
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="w-32 h-32 rounded-3xl p-4 flex items-center justify-center relative overflow-hidden shadow-2xl border border-white/10"
                  style={{ background: house.gradient }}
                >
                  <img src={house.logo} alt={house.name} className={`w-full h-full object-contain ${house.logoScale}`} />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full glass border-white/10 hover:bg-white/10 text-xs uppercase tracking-widest font-bold"
                      onClick={() => setEditingHouse(house)}
                    >
                      <Edit2 className="w-3 h-3 mr-2" />
                      Edit Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-strong border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit House: {house.name}</DialogTitle>
                    </DialogHeader>
                    {editingHouse && (
                      <form onSubmit={handleUpdateHouse} className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>House Name</Label>
                            <Input 
                              value={editingHouse.name} 
                              onChange={(e) => setEditingHouse({...editingHouse, name: e.target.value})}
                              className="glass border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tagline</Label>
                            <Input 
                              value={editingHouse.tagline} 
                              onChange={(e) => setEditingHouse({...editingHouse, tagline: e.target.value})}
                              className="glass border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Captain Name</Label>
                            <Input 
                              value={editingHouse.captain.name} 
                              onChange={(e) => setEditingHouse({...editingHouse, captain: {...editingHouse.captain, name: e.target.value}})}
                              className="glass border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Vice Captain</Label>
                            <Input 
                              value={editingHouse.vice.name} 
                              onChange={(e) => setEditingHouse({...editingHouse, vice: {...editingHouse.vice, name: e.target.value}})}
                              className="glass border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Faculty Coordinator</Label>
                            <Input 
                              value={editingHouse.faculty.name} 
                              onChange={(e) => setEditingHouse({...editingHouse, faculty: {...editingHouse.faculty, name: e.target.value}})}
                              className="glass border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Accent Color (Hex)</Label>
                            <div className="flex gap-2">
                              <Input 
                                value={editingHouse.accent} 
                                onChange={(e) => setEditingHouse({...editingHouse, accent: e.target.value})}
                                className="glass border-white/10"
                              />
                              <div className="w-10 h-10 rounded-lg shrink-0 border border-white/10" style={{ backgroundColor: editingHouse.accent }} />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>About</Label>
                          <Textarea 
                            value={editingHouse.about} 
                            onChange={(e) => setEditingHouse({...editingHouse, about: e.target.value})}
                            className="glass border-white/10 min-h-[100px]"
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="bg-gold text-background font-bold hover:bg-gold/90">
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">{house.name}</h2>
                  <p className="text-sm text-gold font-medium uppercase tracking-[0.3em] mt-1">{house.tagline}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <User className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Captain</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{house.captain.name}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Vice Captain</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{house.vice.name}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Faculty</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{house.faculty.name}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Palette className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Accent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: house.accent }} />
                      <span className="text-sm font-mono text-white/70">{house.accent}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
