import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useData, AdminEvent } from '@/lib/store'
import AccessDenied from '@/components/admin/shared/AccessDenied'
import PageHeader from '@/components/admin/shared/PageHeader'
import { useState } from 'react'
import { 
  Edit, 
  Eye, 
  EyeOff, 
  Search, 
  Users, 
  Trophy, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  MoreVertical
} from 'lucide-react'
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_layout/events')({
  component: EventsPage,
})

function EventsPage() {
  const { hasPermission } = useAuth()
  const { events, updateEvent } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null)

  if (!hasPermission('events', 'read')) {
    return <AccessDenied />
  }

  const filteredEvents = events.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleVisibility = (event: AdminEvent) => {
    updateEvent({ ...event, visibility: !event.visibility })
    toast.success(`Event ${event.name} is now ${!event.visibility ? 'visible' : 'hidden'}`)
  }

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEvent) {
      updateEvent(editingEvent)
      setEditingEvent(null)
      toast.success('Event updated successfully')
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Events Management"
        subtitle="Manage SIMMAM events, categories, and visibility"
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events or categories..."
            className="pl-10 glass border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEvents.map((event) => (
          <div 
            key={event.id}
            className={`glass-strong rounded-3xl p-6 relative group border transition-all ${
              event.visibility ? 'border-white/5' : 'border-white/5 opacity-60'
            } hover:border-gold/30`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${event.visibility ? 'bg-gold/10 text-gold' : 'bg-white/5 text-muted-foreground'}`}>
                <event.icon className="w-6 h-6" />
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleToggleVisibility(event)}
                  className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition"
                  title={event.visibility ? 'Hide from public' : 'Show to public'}
                >
                  {event.visibility ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <Dialog>
                  <DialogTrigger asChild>
                    <button 
                      className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="glass-strong border-white/10 text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Event: {event.name}</DialogTitle>
                    </DialogHeader>
                    {editingEvent && (
                      <form onSubmit={handleUpdateEvent} className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Event Name</Label>
                            <Input 
                              value={editingEvent.name} 
                              onChange={(e) => setEditingEvent({...editingEvent, name: e.target.value})}
                              className="glass border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Input 
                              value={editingEvent.category} 
                              onChange={(e) => setEditingEvent({...editingEvent, category: e.target.value})}
                              className="glass border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select 
                              value={editingEvent.status} 
                              onValueChange={(val: any) => setEditingEvent({...editingEvent, status: val})}
                            >
                              <SelectTrigger className="glass border-white/10">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent className="glass-strong border-white/10">
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Participant Count</Label>
                            <Input 
                              type="number"
                              value={editingEvent.participantCount} 
                              onChange={(e) => setEditingEvent({...editingEvent, participantCount: parseInt(e.target.value)})}
                              className="glass border-white/10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Prize Info</Label>
                          <Input 
                            value={editingEvent.prizeInfo} 
                            onChange={(e) => setEditingEvent({...editingEvent, prizeInfo: e.target.value})}
                            className="glass border-white/10"
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
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">{event.name}</h3>
              <p className="text-xs tracking-widest text-muted-foreground uppercase">{event.category}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-tighter">Participants</span>
                </div>
                <div className="text-lg font-bold text-white">{event.participantCount}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-tighter">Status</span>
                </div>
                <div className={`text-xs font-bold capitalize ${
                  event.status === 'ongoing' ? 'text-green-400' : 
                  event.status === 'upcoming' ? 'text-yellow-400' : 'text-muted-foreground'
                }`}>
                  {event.status}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-gold" />
                <span>{event.prizeInfo}</span>
              </div>
              {!event.visibility && <span className="text-red-400 font-bold uppercase tracking-widest">Hidden</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}