import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useData, Participant } from '@/lib/store'
import AccessDenied from '@/components/admin/shared/AccessDenied'
import PageHeader from '@/components/admin/shared/PageHeader'
import { useState } from 'react'
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  Mail,
  User,
  Download,
  Award
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_layout/participants')({
  component: ParticipantsManagement,
})

function ParticipantsManagement() {
  const { hasPermission } = useAuth()
  const { participants, updateParticipant } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [eventFilter, setEventFilter] = useState('All')

  if (!hasPermission('participants', 'read')) {
    return <AccessDenied />
  }

  const eventsList = ['All', ...new Set(participants.map(p => p.event))]

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEvent = eventFilter === 'All' || p.event === eventFilter
    return matchesSearch && matchesEvent
  })

  const toggleCheckIn = (participant: Participant) => {
    updateParticipant({ ...participant, checkIn: !participant.checkIn })
    toast.success(`${participant.name} ${!participant.checkIn ? 'checked in' : 'check-in undone'}`)
  }

  const toggleCertificate = (participant: Participant) => {
    updateParticipant({ ...participant, certificate: !participant.certificate })
    toast.success(`Certificate eligibility updated for ${participant.name}`)
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Participants"
        subtitle="Manage registrations, attendance, and certificates"
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/5">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, reg no, or email..."
            className="pl-10 glass border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground ml-2" />
          <select 
            className="glass border-white/10 rounded-xl px-4 py-2 text-sm bg-[#0a0515] text-white focus:outline-none"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
          >
            {eventsList.map(event => (
              <option key={event} value={event}>{event}</option>
            ))}
          </select>
          <Button variant="outline" className="glass border-white/10 ml-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="glass-strong rounded-3xl overflow-hidden border border-white/5">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Name / Reg No</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">House</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Event</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Status</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Check-In</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Certificate</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.map((p) => (
              <TableRow key={p.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell>
                  <div>
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{p.regNo}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-gold/30 text-gold text-[10px] uppercase tracking-widest px-2 py-0">
                    {p.house}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-white/80">{p.event}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'confirmed' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    <span className="text-xs capitalize text-white/70">{p.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <button 
                    onClick={() => toggleCheckIn(p)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                      p.checkIn 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {p.checkIn ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                    {p.checkIn ? 'In' : 'Pending'}
                  </button>
                </TableCell>
                <TableCell>
                  <button 
                    onClick={() => toggleCertificate(p)}
                    className={`p-2 rounded-xl transition-colors ${p.certificate ? 'text-gold' : 'text-muted-foreground hover:text-white'}`}
                    title={p.certificate ? 'Eligible' : 'Not eligible'}
                  >
                    <Award className={`w-5 h-5 ${p.certificate ? 'fill-gold/20' : ''}`} />
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-strong border-white/10 text-white">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="focus:bg-white/5 cursor-pointer">
                        <User className="w-4 h-4 mr-2" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-white/5 cursor-pointer">
                        <Mail className="w-4 h-4 mr-2" /> Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem className="focus:bg-red-500/20 text-red-400 cursor-pointer">
                        <XCircle className="w-4 h-4 mr-2" /> Cancel Registration
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}