import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  display_duration: number;
  priority: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
}

export function AnnouncementPopup() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
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

    // Check for active announcements from content.json
    const checkForAnnouncements = async () => {
      try {
        const response = await fetch("/content.json");
        const data = await response.json();
        
        if (!data.announcements || data.announcements.length === 0) {
          return;
        }

        // Filter for currently active announcements
        const now = new Date();
        const activeAnnouncements = data.announcements.filter((ann: Announcement) => {
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

          // Check if user has already seen this announcement
          const hasSeen = localStorage.getItem(`announcement_seen_${activeAnnouncement.id}`);
          if (!hasSeen) {
            setIsVisible(true);
          }
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

  const handleClose = async () => {
    if (announcement) {
      // Mark as viewed in localStorage
      localStorage.setItem(`announcement_seen_${announcement.id}`, "true");
      setIsVisible(false);
    }
  };

  const handleAutoClose = () => {
    if (announcement && announcement.display_duration > 0) {
      setTimeout(() => {
        handleClose();
      }, announcement.display_duration);
    }
  };

  useEffect(() => {
    if (isVisible && announcement) {
      handleAutoClose();
    }
  }, [isVisible, announcement]);

  if (!announcement || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-auto glass-card-hover animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={16} />
              <span>Special Announcement</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>

          {announcement.image_url && (
            <div className="mb-4">
              <img
                src={announcement.image_url}
                alt={announcement.title}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}

          <h3 className="text-lg font-semibold mb-2">{announcement.title}</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {announcement.content}
          </p>

          <div className="flex justify-end">
            <Button onClick={handleClose} size="sm">
              Got it!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}