import { useState, useEffect } from "react";
import { X, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loadContentWithLiveEditor } from "@/utils/contentLoader";

const ANNOUNCEMENT_SUBJECT_IMAGE = "https://uiverse.io/astronaut.png";

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
  };

  if (!announcement || !isVisible) return null;

  return (
    <>
    <div className="announcement-popup-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <Card className="announcement-popup-card relative mx-auto w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="announcement-popup-stars announcement-popup-stars--one" aria-hidden="true" />
        <div className="announcement-popup-stars announcement-popup-stars--two" aria-hidden="true" />
        <div className="announcement-popup-streak announcement-popup-streak--one" aria-hidden="true" />
        <div className="announcement-popup-streak announcement-popup-streak--two" aria-hidden="true" />
        <div className="announcement-popup-streak announcement-popup-streak--three" aria-hidden="true" />
        <img
          src={ANNOUNCEMENT_SUBJECT_IMAGE}
          alt=""
          className="announcement-popup-subject"
          aria-hidden="true"
        />
        <CardContent className="announcement-popup-content relative p-6 md:p-7">
          <div className="flex items-start justify-between mb-4">
            <div className="announcement-popup-badge flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-white/80 backdrop-blur-xl">
              <Clock size={16} />
              <span>Welcome Message</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="announcement-popup-close h-8 w-8 rounded-full p-0 text-white hover:text-white"
            >
              <X size={16} />
            </Button>
          </div>

          <div className="announcement-popup-kicker mb-2 flex items-center gap-2 text-primary">
            <Sparkles size={16} />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">Glad You&apos;re Here</span>
          </div>
          <h3 className="announcement-popup-title mb-2 text-xl font-semibold text-white">{announcement.title}</h3>
          <p className="announcement-popup-text mb-5 whitespace-pre-line leading-relaxed text-white/75">
            {announcement.content}
          </p>

          <div className="announcement-popup-actions flex items-center justify-end gap-3">
            <Button onClick={handleClose} size="sm" className="announcement-popup-primary ml-auto rounded-xl px-4">
              Got it!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </>
  );
}