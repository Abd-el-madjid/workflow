-- Database setup for visa checklist app
-- Run this in your Supabase SQL editor

-- Table for checklist states (already exists)
CREATE TABLE IF NOT EXISTS checklist_states (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table for user letters
CREATE TABLE IF NOT EXISTS user_letters (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  letter_id TEXT NOT NULL, -- 'l1', 'l2', etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT, -- For uploaded files
  file_name TEXT, -- Original file name
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, letter_id)
);

-- Enable RLS
ALTER TABLE checklist_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_letters ENABLE ROW LEVEL SECURITY;

-- Policies for checklist_states
CREATE POLICY "Users can view own checklist states" ON checklist_states
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklist states" ON checklist_states
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklist states" ON checklist_states
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for user_letters
CREATE POLICY "Users can view own letters" ON user_letters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own letters" ON user_letters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own letters" ON user_letters
  FOR UPDATE USING (auth.uid() = user_id);

-- Storage bucket for letter uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('letters', 'letters', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for letters bucket
CREATE POLICY "Users can upload own letter files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'letters' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "Users can update own letter files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'letters' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "Users can view own letter files" ON storage.objects
  FOR SELECT USING (bucket_id = 'letters' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "Users can delete own letter files" ON storage.objects
  FOR DELETE USING (bucket_id = 'letters' AND auth.uid()::text = (string_to_array(name, '/'))[1]);