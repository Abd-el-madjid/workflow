-- Database setup for visa checklist app
-- Run this in your Supabase SQL editor

-- Table for checklist states (already exists)
CREATE TABLE IF NOT EXISTS checklist_states (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  state JSONB NOT NULL,
  checked_count INTEGER NOT NULL DEFAULT 0,
  total_count INTEGER NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE checklist_states ADD COLUMN IF NOT EXISTS checked_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE checklist_states ADD COLUMN IF NOT EXISTS total_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE checklist_states ADD COLUMN IF NOT EXISTS percentage INTEGER NOT NULL DEFAULT 0;

-- Table for user letters
CREATE TABLE IF NOT EXISTS user_letters (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  letter_id TEXT NOT NULL, -- 'l1', 'l2', etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_path TEXT, -- Private storage path in Supabase
  file_name TEXT, -- Original uploaded file name
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, letter_id)
);

-- Table for letter history/versions
CREATE TABLE IF NOT EXISTS letter_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  letter_id TEXT NOT NULL, -- 'l1', 'l2', etc.
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_path TEXT, -- Private storage path in Supabase
  file_name TEXT, -- Original uploaded file name
  version_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, letter_id, version_number)
);

-- Table for document uploads
CREATE TABLE IF NOT EXISTS document_uploads (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id TEXT NOT NULL, -- Section id like 'cf', 'dip', etc.
  name TEXT NOT NULL, -- Document name
  title TEXT NOT NULL, -- Document title
  file_url TEXT NOT NULL, -- Public URL to the uploaded file
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_letters ADD COLUMN IF NOT EXISTS file_path TEXT;
ALTER TABLE user_letters ADD COLUMN IF NOT EXISTS file_name TEXT;

-- Enable RLS
ALTER TABLE checklist_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE letter_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_uploads ENABLE ROW LEVEL SECURITY;

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

-- Policies for letter_history
CREATE POLICY "Users can view own letter history" ON letter_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own letter history" ON letter_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for document_uploads
CREATE POLICY "Users can view own document uploads" ON document_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own document uploads" ON document_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own document uploads" ON document_uploads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own document uploads" ON document_uploads
  FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for letter uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('letters', 'letters', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
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

-- Storage policies for documents bucket
CREATE POLICY "Users can upload own document files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "Users can update own document files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'documents' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "Users can view own document files" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "Users can delete own document files" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

-- ===========================================
-- DYNAMIC DATA MANAGEMENT TABLES
-- ===========================================

-- Projects table (for multiple projects per user)
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Menu categories (avant-visa, apres-visa, lettres)
CREATE TABLE IF NOT EXISTS menu_categories (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL, -- 'avant-visa', 'apres-visa', 'lettres'
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, category_id)
);

-- Sections (the main checklist sections)
CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL, -- unique identifier like 'cf', 'dip', etc.
  category_id TEXT NOT NULL, -- which menu category it belongs to
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  background_color TEXT NOT NULL,
  badge JSONB, -- { "t": "text", "c": "color_class" }
  note JSONB, -- { "t": "html_content", "c": "color_class" }
  chain BOOLEAN DEFAULT false, -- for sequential sections
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, section_id)
);

-- Items (checklist items within sections)
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL, -- unique identifier like 'cf1', 'dip1', etc.
  title TEXT NOT NULL,
  description TEXT,
  details TEXT, -- detailed instructions
  tags JSONB DEFAULT '[]', -- array of tag strings like ["req", "opt"]
  linked_to TEXT, -- reference to another item id
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_id, item_id)
);

-- Explanations (for definition pages)
CREATE TABLE IF NOT EXISTS explanations (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- HTML content
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Letter templates
CREATE TABLE IF NOT EXISTS letter_templates (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  letter_id TEXT NOT NULL, -- unique identifier like 'l1', 'l2', etc.
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, letter_id)
);

-- Enable RLS for new tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE letter_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
CREATE POLICY "Users can only access their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access categories for their projects" ON menu_categories
  FOR ALL USING (EXISTS (SELECT 1 FROM projects WHERE id = menu_categories.project_id AND user_id = auth.uid()));

CREATE POLICY "Users can only access sections for their projects" ON sections
  FOR ALL USING (EXISTS (SELECT 1 FROM projects WHERE id = sections.project_id AND user_id = auth.uid()));

CREATE POLICY "Users can only access items for their project sections" ON items
  FOR ALL USING (EXISTS (SELECT 1 FROM sections s JOIN projects p ON s.project_id = p.id WHERE s.id = items.section_id AND p.user_id = auth.uid()));

CREATE POLICY "Users can only access explanations for their project sections" ON explanations
  FOR ALL USING (EXISTS (SELECT 1 FROM sections s JOIN projects p ON s.project_id = p.id WHERE s.id = explanations.section_id AND p.user_id = auth.uid()));

CREATE POLICY "Users can only access letter templates for their projects" ON letter_templates
  FOR ALL USING (EXISTS (SELECT 1 FROM projects WHERE id = letter_templates.project_id AND user_id = auth.uid()));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_project_id ON menu_categories(project_id);
CREATE INDEX IF NOT EXISTS idx_sections_project_id ON sections(project_id);
CREATE INDEX IF NOT EXISTS idx_sections_category_id ON sections(category_id);
CREATE INDEX IF NOT EXISTS idx_items_section_id ON items(section_id);
CREATE INDEX IF NOT EXISTS idx_explanations_section_id ON explanations(section_id);
CREATE INDEX IF NOT EXISTS idx_letter_templates_project_id ON letter_templates(project_id);