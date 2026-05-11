import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useData } from '@/lib/store'
import AccessDenied from '@/components/admin/shared/AccessDenied'
import PageHeader from '@/components/admin/shared/PageHeader'
import { useState } from 'react'
import { Plus, Minus, Save, Trophy, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/_layout/leaderboard')({
  component: LeaderboardManagement,
})

function LeaderboardManagement() {
  const { hasPermission } = useAuth()
  const { houses, updateHousePoints } = useData()
  const [pointAdjustments, setPointAdjustments] = useState<Record<string, number>>({})

  if (!hasPermission('leaderboard', 'update')) {
    return <AccessDenied />
  }

  const handleAdjustPoints = (houseName: string, amount: number) => {
    setPointAdjustments(prev => ({
      ...prev,
      [houseName]: (prev[houseName] || 0) + amount
    }))
  }

  const handleSavePoints = (houseName: string) => {
    const adjustment = pointAdjustments[houseName] || 0
    if (adjustment === 0) return

    updateHousePoints(houseName, adjustment)
    setPointAdjustments(prev => ({ ...prev, [houseName]: 0 }))
    toast.success(`Points updated for ${houseName}`)
  }

  const sortedHouses = [...houses].sort((a, b) => b.points2025 - a.points2025)

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Leaderboard Management"
        subtitle="Live scoring and house rankings for SIMMAM 2026"
      />

      <div className="grid gap-6">
        {sortedHouses.map((house, index) => {
          const adjustment = pointAdjustments[house.name] || 0
          const finalPoints = house.points2025 + adjustment
          
          return (
            <div 
              key={house.name}
              className="glass-strong rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-6 flex-1 w-full">
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl"
                    style={{ background: house.gradient }}
                  >
                    {index + 1}
                  </div>
                  {index === 0 && (
                    <Trophy className="absolute -top-3 -left-3 w-8 h-8 text-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{house.name}</h3>
                    <span className="text-[10px] tracking-widest text-muted-foreground uppercase">{house.tagline}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="text-3xl font-black text-white tracking-tighter">
                      {finalPoints.toLocaleString()}
                      <span className="text-xs text-muted-foreground ml-2 font-medium uppercase tracking-widest">Points</span>
                    </div>
                    {adjustment !== 0 && (
                      <div className={`flex items-center gap-1 text-sm font-bold ${adjustment > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {adjustment > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {adjustment > 0 ? '+' : ''}{adjustment}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto bg-white/5 p-3 rounded-2xl">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl hover:bg-red-500/20 hover:text-red-400"
                  onClick={() => handleAdjustPoints(house.name, -100)}
                >
                  <Minus className="w-5 h-5" />
                </Button>
                
                <div className="w-20">
                  <Input 
                    type="number" 
                    value={adjustment}
                    onChange={(e) => setPointAdjustments(prev => ({ ...prev, [house.name]: parseInt(e.target.value) || 0 }))}
                    className="text-center bg-transparent border-none focus-visible:ring-0 text-white font-bold text-lg"
                  />
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl hover:bg-green-500/20 hover:text-green-400"
                  onClick={() => handleAdjustPoints(house.name, 100)}
                >
                  <Plus className="w-5 h-5" />
                </Button>

                <div className="w-px h-8 bg-white/10 mx-2" />

                <Button 
                  className="bg-white text-black hover:bg-white/90 rounded-xl font-bold px-6"
                  disabled={adjustment === 0}
                  onClick={() => handleSavePoints(house.name)}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}