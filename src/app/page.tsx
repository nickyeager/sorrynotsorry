import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Gamepad2 } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <main className="flex flex-col items-center text-center max-w-md space-y-8">
        <div className="flex items-center gap-3">
          <Gamepad2 className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">SorryNotSorry</h1>
        </div>

        <p className="text-lg text-muted-foreground">
          Track your pickleball games, scores, and friendly wagers with friends.
          Never forget who owes who again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 text-left">
          <div className="space-y-2">
            <h3 className="font-semibold">Track Games</h3>
            <p className="text-sm text-muted-foreground">
              Log singles and doubles matches with locations and scores
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Manage Wagers</h3>
            <p className="text-sm text-muted-foreground">
              Keep track of friendly bets and who owes what
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Settle Up</h3>
            <p className="text-sm text-muted-foreground">
              Mark debts as paid and maintain a clear ledger
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
