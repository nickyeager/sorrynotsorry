import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'

export default async function LedgerPage() {
  // For Phase 1, we show empty states since ledger functionality
  // depends on game completion with players (Phase 2)
  const totalOwedToYou = 0
  const totalYouOwe = 0
  const balanceList: { id: string; name: string; amount: number }[] = []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ledger</h2>
        <p className="text-muted-foreground">Track who owes what</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Owed to You</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              +${totalOwedToYou.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {balanceList.filter(b => b.amount > 0).length} players
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">You Owe</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              -${totalYouOwe.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              To {balanceList.filter(b => b.amount < 0).length} players
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Balances list */}
      <Card>
        <CardHeader>
          <CardTitle>Balances</CardTitle>
          <CardDescription>Outstanding amounts with other players</CardDescription>
        </CardHeader>
        <CardContent>
          {balanceList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">All settled up!</h3>
              <p className="text-sm text-muted-foreground">
                No outstanding balances. Complete games with wagers to see balances here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {balanceList.map((balance) => (
                <div
                  key={balance.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{balance.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {balance.amount > 0 ? 'Owes you' : 'You owe'}
                    </p>
                  </div>
                  <div className={`text-lg font-bold ${balance.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {balance.amount > 0 ? '+' : ''}${balance.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
