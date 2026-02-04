import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Users, Search } from 'lucide-react'

export default async function PlayersPage() {
  // For Phase 1, we show empty states since player network functionality
  // depends on adding players to games (Phase 2)
  const opponents: { id: string; username: string; display_name: string | null; avatar_url: string | null; games_count: number }[] = []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Players</h2>
        <p className="text-muted-foreground">People you&apos;ve played with</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search players..."
          className="pl-10"
          disabled
        />
        <p className="text-xs text-muted-foreground mt-1">
          Search coming in Phase 2
        </p>
      </div>

      {/* Players list */}
      <Card>
        <CardHeader>
          <CardTitle>Your Network</CardTitle>
          <CardDescription>Players you&apos;ve had games with</CardDescription>
        </CardHeader>
        <CardContent>
          {opponents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No opponents yet</h3>
              <p className="text-sm text-muted-foreground">
                Add players to your games to build your network (coming in Phase 2)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {opponents.map((player) => {
                const initials = player.display_name
                  ? player.display_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : player.username.charAt(0).toUpperCase()

                return (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium">{initials}</span>
                      </div>
                      <div>
                        <p className="font-medium">{player.display_name || player.username}</p>
                        <p className="text-sm text-muted-foreground">@{player.username}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {player.games_count} {player.games_count === 1 ? 'game' : 'games'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
