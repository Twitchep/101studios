import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Eye, Settings } from "lucide-react";

export function AnnouncementDemo() {
  const [demoAnnouncement] = useState({
    id: "demo-1",
    title: "🎉 Welcome to 101 Studios!",
    content: "We're excited to have you here! Check out our latest portfolio pieces and don't forget to explore our shop for unique tech gadgets.",
    image_url: "/images/portfolio/project1.jpg",
    is_active: true,
    start_date: "2026-03-21T00:00",
    end_date: "2026-03-31T23:59",
    display_duration: 8000,
    priority: 10,
    target_audience: "new_visitors",
    max_views_per_user: 3,
    created_at: "2026-03-21T09:00:00Z"
  });

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.16)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Announcement System Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <h3 className="font-semibold mb-2">How the Announcement System Works:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• <strong>Popup Display:</strong> Announcements appear as modal popups on your website</li>
              <li>• <strong>Smart Scheduling:</strong> Set start/end dates for when announcements should show</li>
              <li>• <strong>Duration Control:</strong> Configure how long each popup stays visible</li>
              <li>• <strong>Priority System:</strong> Higher priority announcements show first</li>
              <li>• <strong>Reload Cadence:</strong> Active announcements show every third page reload</li>
              <li>• <strong>Target Audience:</strong> Show to all visitors, new visitors, or returning visitors</li>
              <li>• <strong>Rich Content:</strong> Include images, formatted text, and call-to-action buttons</li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Sample Announcement Configuration:</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <p className="text-sm text-muted-foreground">{demoAnnouncement.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <p className="text-sm text-muted-foreground">{demoAnnouncement.content}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <p className="text-sm text-muted-foreground font-mono">{demoAnnouncement.image_url}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={demoAnnouncement.is_active ? "default" : "secondary"}>
                    {demoAnnouncement.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(demoAnnouncement.start_date).toLocaleDateString()} - {new Date(demoAnnouncement.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{demoAnnouncement.display_duration / 1000}s display duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm capitalize">{demoAnnouncement.target_audience.replace("_", " ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">Max {demoAnnouncement.max_views_per_user} views per user</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Setup Instructions:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>1. Database Setup:</strong> Run the migration file <code className="bg-muted px-1 py-0.5 rounded">supabase/migrations/20260321100000_create_announcements_table.sql</code></p>
              <p><strong>2. Admin Access:</strong> Go to <code className="bg-muted px-1 py-0.5 rounded">/admin</code> → Announcements tab</p>
              <p><strong>3. Create Announcement:</strong> Click "Add New" and fill in the details</p>
              <p><strong>4. Test:</strong> Visit your website to see the popup in action</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/admin" target="_blank">Open Admin Panel</a>
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Test Popup System
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}