-- Create announcements table for popup messages
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  display_duration INTEGER DEFAULT 5000, -- milliseconds
  priority INTEGER DEFAULT 0, -- higher priority shows first
  target_audience TEXT DEFAULT 'all', -- 'all', 'new_visitors', 'returning_visitors'
  max_views_per_user INTEGER DEFAULT -1, -- -1 means unlimited
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active announcements
CREATE POLICY "Anyone can view active announcements" ON public.announcements
  FOR SELECT USING (is_active = true);

-- Allow admins to manage announcements (we'll need to set up proper admin auth)
CREATE POLICY "Admins can manage announcements" ON public.announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create user_announcement_views table to track views
CREATE TABLE public.user_announcement_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT, -- anonymous users get a generated ID
  announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, announcement_id)
);

-- Add RLS for views tracking
ALTER TABLE public.user_announcement_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own announcement views" ON public.user_announcement_views
  FOR SELECT USING (user_id = auth.uid()::text OR user_id LIKE 'anon_%');

CREATE POLICY "Users can insert their own announcement views" ON public.user_announcement_views
  FOR INSERT WITH CHECK (user_id = auth.uid()::text OR user_id LIKE 'anon_%');

-- Function to get active announcements for a user
CREATE OR REPLACE FUNCTION get_active_announcements(p_user_id TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  image_url TEXT,
  display_duration INTEGER,
  priority INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    a.content,
    a.image_url,
    a.display_duration,
    a.priority
  FROM public.announcements a
  WHERE a.is_active = true
    AND (a.start_date IS NULL OR a.start_date <= now())
    AND (a.end_date IS NULL OR a.end_date >= now())
    AND (
      a.max_views_per_user = -1
      OR NOT EXISTS (
        SELECT 1 FROM public.user_announcement_views v
        WHERE v.announcement_id = a.id
          AND v.user_id = COALESCE(p_user_id, 'anon_' || session_user::text)
          AND (
            SELECT COUNT(*) FROM public.user_announcement_views v2
            WHERE v2.announcement_id = a.id AND v2.user_id = v.user_id
          ) >= a.max_views_per_user
      )
    )
  ORDER BY a.priority DESC, a.created_at DESC
  LIMIT 1; -- Return only the highest priority active announcement
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;