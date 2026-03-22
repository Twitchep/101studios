import { useState, useEffect } from "react";
import { X, Clock, Sparkles, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LazyImage from "./LazyImage";
import { loadContentWithLiveEditor } from "@/utils/contentLoader";

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  display_duration: number;
  priority: number;
  reload_frequency?: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
}

export function AnnouncementPopup() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const pageLoadToken = String(performance.timeOrigin || Date.now());

    // Generate or get user ID for tracking views
    const getUserId = () => {
      let id = localStorage.getItem("announcement_user_id");
      if (!id) {
        id = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("announcement_user_id", id);
      }
      return id;
    };

    const userId = getUserId();
    setUserId(userId);

    const incrementReloadCount = (announcementId: string) => {
      const loadMarkerKey = `announcement_load_marker_${announcementId}`;
      const reloadCountKey = `announcement_reload_count_${announcementId}`;
      const lastLoadMarker = sessionStorage.getItem(loadMarkerKey);

      if (lastLoadMarker === pageLoadToken) {
        const existingCount = parseInt(localStorage.getItem(reloadCountKey) || "0", 10);
        return Number.isNaN(existingCount) ? 0 : existingCount;
      }

      const previousCount = parseInt(localStorage.getItem(reloadCountKey) || "0", 10);
      const nextCount = (Number.isNaN(previousCount) ? 0 : previousCount) + 1;

      localStorage.setItem(reloadCountKey, String(nextCount));
      sessionStorage.setItem(loadMarkerKey, pageLoadToken);

      return nextCount;
    };

    const resetAnnouncementState = (announcementId: string) => {
      localStorage.removeItem(`announcement_reload_count_${announcementId}`);
      sessionStorage.removeItem(`announcement_load_marker_${announcementId}`);
    };

    // Check for active announcements from live editor/supabase/content fallback
    const checkForAnnouncements = async () => {
      try {
        const announcements = await loadContentWithLiveEditor('announcements', 'announcements');

        if (!announcements || announcements.length === 0) {
          setIsVisible(false);
          return;
        }

        // Filter for currently active announcements
        const now = new Date();
        const activeAnnouncements = announcements.filter((ann: Announcement) => {
          if (!ann.is_active) return false;
          if (ann.start_date && new Date(ann.start_date) > now) return false;
          if (ann.end_date && new Date(ann.end_date) < now) return false;
          return true;
        });

        if (activeAnnouncements.length > 0) {
          // Sort by priority (higher first) and pick the first one
          const sortedAnnouncements = activeAnnouncements.sort((a: Announcement, b: Announcement) => (b.priority || 0) - (a.priority || 0));
          const activeAnnouncement = sortedAnnouncements[0];
          setAnnouncement(activeAnnouncement);

          const inactiveAnnouncements = (announcements || []).filter((ann: Announcement) => ann.id !== activeAnnouncement.id);
          inactiveAnnouncements.forEach((ann: Announcement) => resetAnnouncementState(ann.id));

          const reloadCount = incrementReloadCount(activeAnnouncement.id);
          const reloadFrequency = Math.max(1, activeAnnouncement.reload_frequency || 3);
          const shouldShowOnThisReload = reloadCount > 0 && reloadCount % reloadFrequency === 0;

          if (shouldShowOnThisReload) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        console.error("Error checking announcements:", error);
      }
    };

    // Check immediately and then every 5 minutes
    checkForAnnouncements();
    const interval = setInterval(checkForAnnouncements, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userId]);

  const handleClose = () => {
    setIsVisible(false);
    setLightboxOpen(false);
  };

  if (!announcement || !isVisible) return null;

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <Card className="relative w-full max-w-lg mx-auto overflow-hidden border border-white/15 bg-white/12 dark:bg-white/8 backdrop-blur-2xl shadow-[0_24px_90px_rgba(0,0,0,0.45)] animate-fade-in">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.2),transparent_35%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <CardContent className="relative p-6 md:p-7">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white/80 backdrop-blur-xl">
              <Clock size={16} />
              <span>Special Announcement</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </Button>
          </div>

          {announcement.image_url && (
            <div className="group relative mb-5 overflow-hidden rounded-2xl border border-white/10 bg-black/10 shadow-inner shadow-black/20 cursor-pointer" onClick={() => setLightboxOpen(true)}>
              <LazyImage
                src={announcement.image_url}
                alt={announcement.title}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur-xl">
                <Maximize2 size={13} />
                View Full Image
              </div>
            </div>
          )}

          <div className="mb-2 flex items-center gap-2 text-primary">
            <Sparkles size={16} />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">Live Update</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">{announcement.title}</h3>
          <p className="text-white/75 leading-relaxed mb-5 whitespace-pre-line">
            {announcement.content}
          </p>

          <div className="flex items-center justify-between gap-3">
            {announcement.image_url && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                <Maximize2 size={15} />
                View Image
              </button>
            )}
            <Button onClick={handleClose} size="sm" className="ml-auto rounded-xl bg-gradient-to-r from-primary to-orange-400 px-4 shadow-lg shadow-primary/25 hover:shadow-primary/40">
              Got it!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    {lightboxOpen && announcement.image_url && (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" onClick={() => setLightboxOpen(false)}>
        <div className="relative max-h-[92vh] max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-black/70 shadow-[0_24px_90px_rgba(0,0,0,0.65)]" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-sm text-white backdrop-blur-xl transition hover:bg-black/70"
          >
            Close
          </button>
          <img src={announcement.image_url} alt={announcement.title} className="max-h-[92vh] w-full object-contain" />
        </div>
      </div>
    )}
  </>
  );
}