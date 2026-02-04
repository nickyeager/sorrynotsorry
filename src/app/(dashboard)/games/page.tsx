import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Gamepad2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Tables } from '@/types/database'

type GameWithCreator = Tables<'games'> & {
  creator?: { username: string; display_name: string | null } | null
}

export default async function GamesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get all user's games
  const { data: gamesData } = await supabase
    .from('games')
    .select('*')
    .eq('created_by', user?.id ?? '')
    .order('created_at', { ascending: false })

  const games = (gamesData ?? []) as GameWithCreator[]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>
      case 'pending':
        return <Badge variant="outline">Pending</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Games</h2>
          <p className="text-muted-foreground">View and manage your pickleball games</p>
        </div>
        <Button asChild>
          <Link href="/games/new">
            <Plus className="mr-2 h-4 w-4" />
            New Game
          </Link>
        </Button>
      </div>

      {!games || games.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Gamepad2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No games yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Create your first game to start tracking scores and wagers with friends
            </p>
            <Button asChild>
              <Link href="/games/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Game
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {games.map((game) => (
            <Card key={game.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">{game.game_type}</CardTitle>
                  {getStatusBadge(game.status)}
                </div>
                <CardDescription>
                  {game.location || 'No location specified'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    {game.status === 'completed' && game.team1_score !== null ? (
                      <p className="font-medium text-lg">
                        {game.team1_score} - {game.team2_score}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">No score yet</p>
                    )}
                    <p className="text-muted-foreground">
                      ${Number(game.wager_amount).toFixed(2)} wager
                    </p>
                  </div>
                  <div className="text-right text-muted-foreground">
                    <p>
                      Created by {game.creator?.display_name || game.creator?.username}
                    </p>
                    <p>
                      {formatDistanceToNow(new Date(game.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
