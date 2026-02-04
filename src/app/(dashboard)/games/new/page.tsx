'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Tables } from '@/types/database'

export default function NewGamePage() {
  const [gameType, setGameType] = useState<'singles' | 'doubles'>('doubles')
  const [location, setLocation] = useState('')
  const [wagerAmount, setWagerAmount] = useState('0')
  const [recentLocations, setRecentLocations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadLocations() {
      const supabase = createClient()
      const { data } = await supabase
        .from('locations')
        .select('name')
        .order('created_at', { ascending: false })
        .limit(5)

      if (data && Array.isArray(data)) {
        setRecentLocations((data as Pick<Tables<'locations'>, 'name'>[]).map(l => l.name))
      }
    }
    loadLocations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const wager = parseFloat(wagerAmount)
    if (isNaN(wager) || wager < 0 || wager > 100) {
      toast.error('Wager must be between $0 and $100')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('You must be logged in')
      router.push('/login')
      return
    }

    // Create the game
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: gameData, error } = await (supabase as any)
      .from('games')
      .insert({
        game_type: gameType,
        location: location || null,
        wager_amount: wager,
        created_by: user.id,
        status: 'pending',
      })
      .select()
      .single()

    if (error || !gameData) {
      toast.error(error?.message || 'Failed to create game')
      setLoading(false)
      return
    }

    const game = gameData as Tables<'games'>

    // Save location if it's new
    if (location && !recentLocations.includes(location)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('locations').insert({
        name: location,
        created_by: user.id,
      })
    }

    // Add creator as a player on team 1
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('game_players').insert({
      game_id: game.id,
      player_id: user.id,
      team: 1,
    })

    toast.success('Game created!')
    router.push('/games')
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/games">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">New Game</h2>
          <p className="text-muted-foreground">Create a new pickleball game</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Details</CardTitle>
          <CardDescription>
            Set up your game. You can add players and record scores later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="gameType">Game Type</Label>
              <Select value={gameType} onValueChange={(v) => setGameType(v as 'singles' | 'doubles')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="singles">Singles (1v1)</SelectItem>
                  <SelectItem value="doubles">Doubles (2v2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Memorial Park Courts"
                list="locations"
              />
              {recentLocations.length > 0 && (
                <datalist id="locations">
                  {recentLocations.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              )}
              <p className="text-xs text-muted-foreground">
                Where are you playing?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wager">Wager Amount ($)</Label>
              <Input
                id="wager"
                type="number"
                min="0"
                max="100"
                step="0.50"
                value={wagerAmount}
                onChange={(e) => setWagerAmount(e.target.value)}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                $0 for friendly games, up to $100 max
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" asChild className="flex-1">
                <Link href="/games">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Game'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
