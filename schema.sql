-- ============================================
-- DynQR Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Profiles table (synced with Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR code groups
CREATE TABLE qr_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR Codes
CREATE TABLE qrcodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES qr_groups(id) ON DELETE SET NULL,
  short_id TEXT UNIQUE NOT NULL,
  title TEXT,
  original_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scans
CREATE TABLE scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qrcode_id UUID REFERENCES qrcodes(id) ON DELETE CASCADE NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_qrcodes_user_id ON qrcodes(user_id);
CREATE INDEX idx_qrcodes_short_id ON qrcodes(short_id);
CREATE INDEX idx_scans_qrcode_id ON scans(qrcode_id);
CREATE INDEX idx_qr_groups_user_id ON qr_groups(user_id);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE qrcodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- QR Groups: users manage their own groups
CREATE POLICY "Users can view own groups"
  ON qr_groups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own groups"
  ON qr_groups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own groups"
  ON qr_groups FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own groups"
  ON qr_groups FOR DELETE
  USING (auth.uid() = user_id);

-- QR Codes: users manage their own codes
CREATE POLICY "Users can view own qrcodes"
  ON qrcodes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own qrcodes"
  ON qrcodes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own qrcodes"
  ON qrcodes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own qrcodes"
  ON qrcodes FOR DELETE
  USING (auth.uid() = user_id);

-- Public policy for QR code lookups (for redirect)
CREATE POLICY "Anyone can view qrcodes by short_id"
  ON qrcodes FOR SELECT
  USING (true);

-- Scans: anyone can insert (public redirect), users can read their scans
CREATE POLICY "Anyone can insert scans"
  ON scans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view scans for own QR codes"
  ON scans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM qrcodes
      WHERE qrcodes.id = scans.qrcode_id
      AND qrcodes.user_id = auth.uid()
    )
  );

-- ============================================
-- Auto-create profile on signup trigger
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
