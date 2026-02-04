import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Gamepad2, Plus, TrendingUp, TrendingDown } from 'lucide-react'

export default async function DashboardPage() {
  // For Phase 1, we show empty/placeholder stats since the full
  // database functionality requires Supabase to be set up
  const recentGames: { id: string; game_type: string; location: string | null; status: string; team1_score: number | null; team2_score: number | null; wager_amount: number }[] = []
  const totalWon = 0
  const totalLost = 0
  const winCount = 0
  const netBalance = totalWon - totalLost

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <Button asChild>
          <Link href="/games/new">
            <Plus className="mr-2 h-4 w-4" />
            New Game
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            {netBalance >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime winnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Games Played</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentGames?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total games
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Won</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              +${totalWon.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {winCount} wins
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent games */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Games</CardTitle>
          <CardDescription>Your latest pickleball matches</CardDescription>
        </CardHeader>
        <CardContent>
          {!recentGames || recentGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Gamepad2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No games yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start tracking your pickleball games and wagers
              </p>
              <Button asChild>
                <Link href="/games/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Game
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium capitalize">{game.game_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {game.location || 'No location'}
                    </p>
                  </div>
                  <div className="text-right">
                    {game.status === 'completed' ? (
                      <>
                        <p className="font-medium">
                          {game.team1_score} - {game.team2_score}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${Number(game.wager_amount).toFixed(2)} wager
                        </p>
                      </>
                    ) : (
                      <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        {game.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/games">View All Games</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
