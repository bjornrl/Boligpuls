-- Bydeler (districts)
CREATE TABLE bydeler (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Posts
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  bydel_id uuid NOT NULL REFERENCES bydeler(id) ON DELETE CASCADE,
  is_newsletter boolean DEFAULT true,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscribers
CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  frequency text NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('weekly', 'monthly')),
  is_active boolean DEFAULT true,
  confirmed boolean DEFAULT false,
  confirm_token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz DEFAULT now()
);

-- Junction table: subscriber <-> bydeler
CREATE TABLE subscriber_bydeler (
  subscriber_id uuid NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  bydel_id uuid NOT NULL REFERENCES bydeler(id) ON DELETE CASCADE,
  PRIMARY KEY (subscriber_id, bydel_id)
);

-- Newsletter send log
CREATE TABLE newsletter_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  subscriber_id uuid NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  sent_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced'))
);

-- Indexes
CREATE INDEX idx_posts_bydel ON posts(bydel_id);
CREATE INDEX idx_posts_published ON posts(is_published, published_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_subscriber_bydeler_bydel ON subscriber_bydeler(bydel_id);
CREATE INDEX idx_newsletter_sends_post ON newsletter_sends(post_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE bydeler ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriber_bydeler ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;

-- Bydeler: everyone can read
CREATE POLICY "bydeler_select" ON bydeler FOR SELECT USING (true);
CREATE POLICY "bydeler_all_auth" ON bydeler FOR ALL USING (auth.role() = 'authenticated');

-- Posts: everyone can read published, authenticated can do everything
CREATE POLICY "posts_select_published" ON posts FOR SELECT USING (is_published = true);
CREATE POLICY "posts_all_auth" ON posts FOR ALL USING (auth.role() = 'authenticated');

-- Subscribers: only authenticated
CREATE POLICY "subscribers_all_auth" ON subscribers FOR ALL USING (auth.role() = 'authenticated');
-- Allow anonymous insert for subscription signup
CREATE POLICY "subscribers_insert_anon" ON subscribers FOR INSERT WITH CHECK (true);

-- Subscriber_bydeler: allow anonymous insert, authenticated full access
CREATE POLICY "subscriber_bydeler_insert_anon" ON subscriber_bydeler FOR INSERT WITH CHECK (true);
CREATE POLICY "subscriber_bydeler_all_auth" ON subscriber_bydeler FOR ALL USING (auth.role() = 'authenticated');

-- Newsletter sends: only authenticated
CREATE POLICY "newsletter_sends_all_auth" ON newsletter_sends FOR ALL USING (auth.role() = 'authenticated');

-- Seed bydeler
INSERT INTO bydeler (slug, name, color) VALUES
  ('midtbyen', 'Midtbyen', '#E8634A'),
  ('lade', 'Lade & Strindheim', '#5B8C5A'),
  ('byasen', 'Byåsen', '#4A7FB5'),
  ('tiller', 'Tiller & Heimdal', '#D4A843'),
  ('moholt', 'Moholt & Dragvoll', '#8B6DB0'),
  ('saupstad', 'Saupstad & Kolstad', '#C75C8A'),
  ('ranheim', 'Ranheim & Charlottenlund', '#45A5A5'),
  ('jakobsli', 'Jakobsli & Vikåsen', '#D17B47');
