-- Add emoji column to bydeler
ALTER TABLE bydeler ADD COLUMN IF NOT EXISTS emoji text NOT NULL DEFAULT '';

-- Add unsubscribe_token to subscribers
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS unsubscribe_token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex');

-- Add author_id to posts (references auth.users)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES auth.users(id);

-- Update bydeler with emojis and new colors
UPDATE bydeler SET emoji = '🏛', color = '#D4593A' WHERE slug = 'midtbyen';
UPDATE bydeler SET emoji = '🌳', color = '#4A7A4A' WHERE slug = 'lade';
UPDATE bydeler SET emoji = '⛷', color = '#3D6E99' WHERE slug = 'byasen';
UPDATE bydeler SET emoji = '🏘', color = '#C4942E' WHERE slug = 'tiller';
UPDATE bydeler SET emoji = '🎓', color = '#7B5EA7' WHERE slug = 'moholt';
UPDATE bydeler SET emoji = '🏡', color = '#B54D73' WHERE slug = 'saupstad';
UPDATE bydeler SET emoji = '🌊', color = '#2E8E8E' WHERE slug = 'ranheim';
UPDATE bydeler SET emoji = '🌄', color = '#C06A2F' WHERE slug = 'jakobsli';

-- Allow anon to update subscribers (for confirmation and unsubscribe)
CREATE POLICY "subscribers_update_anon" ON subscribers FOR UPDATE USING (true) WITH CHECK (true);

-- Allow anonymous select on subscriber_bydeler (needed for confirmation page queries)
CREATE POLICY "subscriber_bydeler_select_anon" ON subscriber_bydeler FOR SELECT USING (true);
