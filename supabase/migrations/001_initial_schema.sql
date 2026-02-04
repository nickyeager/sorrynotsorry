-- SorryNotSorry Initial Schema
-- Run this migration in your Supabase SQL editor

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type TEXT NOT NULL CHECK (game_type IN ('singles', 'doubles')),
  location TEXT,
  wager_amount DECIMAL(10,2) DEFAULT 0 CHECK (wager_amount >= 0 AND wager_amount <= 100),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  team1_score INTEGER CHECK (team1_score >= 0),
  team2_score INTEGER CHECK (team2_score >= 0),
  winner_team INTEGER CHECK (winner_team IN (1, 2)),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Game participants
CREATE TABLE IF NOT EXISTS game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES profiles(id),
  team INTEGER NOT NULL CHECK (team IN (1, 2)),
  UNIQUE(game_id, player_id)
);

-- Ledger entries (money transfers from completed games)
CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id),
  from_player UUID NOT NULL REFERENCES profiles(id),
  to_player UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settlements (when players pay up)
CREATE TABLE IF NOT EXISTS settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_player UUID NOT NULL REFERENCES profiles(id),
  to_player UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  note TEXT,
  settled_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations (for autocomplete)
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_created_by ON games(created_by);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_players_player ON game_players(player_id);
CREATE INDEX IF NOT EXISTS idx_game_players_game ON game_players(game_id);
CREATE INDEX IF NOT EXISTS idx_ledger_from ON ledger_entries(from_player);
CREATE INDEX IF NOT EXISTS idx_ledger_to ON ledger_entries(to_player);
CREATE INDEX IF NOT EXISTS idx_settlements_from ON settlements(from_player);
CREATE INDEX IF NOT EXISTS idx_settlements_to ON settlements(to_player);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read any profile (for search), but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Games: Viewable by participants, creatable by authenticated users
CREATE POLICY "Games viewable by participants" ON games
  FOR SELECT USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM game_players
      WHERE game_players.game_id = games.id
      AND game_players.player_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create games" ON games
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Game creator can update game" ON games
  FOR UPDATE USING (auth.uid() = created_by);

-- Game players: Viewable by game participants
CREATE POLICY "Game players viewable by participants" ON game_players
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_players.game_id
      AND (
        games.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM game_players gp
          WHERE gp.game_id = games.id
          AND gp.player_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Game creator can add players" ON game_players
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_players.game_id
      AND games.created_by = auth.uid()
    )
  );

-- Ledger entries: Viewable by involved parties
CREATE POLICY "Ledger entries viewable by involved parties" ON ledger_entries
  FOR SELECT USING (
    from_player = auth.uid() OR to_player = auth.uid()
  );

CREATE POLICY "System can create ledger entries" ON ledger_entries
  FOR INSERT WITH CHECK (
    from_player = auth.uid() OR to_player = auth.uid()
  );

-- Settlements: Viewable and manageable by involved parties
CREATE POLICY "Settlements viewable by involved parties" ON settlements
  FOR SELECT USING (
    from_player = auth.uid() OR to_player = auth.uid()
  );

CREATE POLICY "Users can create settlements they're involved in" ON settlements
  FOR INSERT WITH CHECK (
    from_player = auth.uid() OR to_player = auth.uid()
  );

-- Locations: Viewable by all, creatable by authenticated users
CREATE POLICY "Locations are viewable by everyone" ON locations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create locations" ON locations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Function to handle new user signup - create profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
