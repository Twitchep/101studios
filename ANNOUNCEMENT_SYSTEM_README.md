# Announcement Popup System

A comprehensive popup/announcement system for your website that allows you to display targeted messages to your visitors with full scheduling and content control.

## Features

### 🎯 **Smart Targeting**
- **Audience Segmentation**: Target all visitors, new visitors, or returning visitors
- **View Limits**: Control how many times each user sees an announcement
- **Priority System**: Higher priority announcements take precedence

### 📅 **Advanced Scheduling**
- **Date Range**: Set exact start and end dates for announcements
- **Auto-Hide**: Configure display duration (how long the popup stays visible)
- **Real-time Updates**: Announcements appear/disappear automatically based on schedule

### 🎨 **Rich Content**
- **Images**: Add eye-catching images to your announcements
- **Formatted Text**: Support for rich text content
- **Responsive Design**: Looks great on all devices

### 📊 **Analytics & Tracking**
- **View Tracking**: Track how many times each announcement is viewed
- **User Management**: Anonymous user tracking to prevent spam
- **Performance Monitoring**: See which announcements perform best

## Setup Instructions

### 1. Database Migration

Run the migration to create the necessary tables:

```sql
-- This SQL is in: supabase/migrations/20260321100000_create_announcements_table.sql
```

Or apply it manually in your Supabase dashboard.

### 2. Live Content Manager Access

1. Go to `http://localhost:8081/live-editor.html` on your website
2. Enter the password: `admin123` (or your custom password)
3. Scroll down to the "Announcements & Popups" section

### 3. Create Your First Announcement

1. Click "Add New" in the Announcements section
2. Fill in the details:
   - **Title**: Eye-catching headline
   - **Content**: Your message text
   - **Image URL**: Upload or link to an image
   - **Active**: Check to enable the announcement
   - **Start/End Date**: When it should appear
   - **Display Duration**: How long it shows (in milliseconds)
   - **Priority**: Higher numbers show first
   - **Target Audience**: Who should see it
   - **Max Views**: How many times per user (-1 = unlimited)

## Field Explanations

| Field | Type | Description |
|-------|------|-------------|
| `title` | Text | The headline of your announcement |
| `content` | Text | The main message content |
| `image_url` | Text | URL of the image to display |
| `is_active` | Boolean | Whether the announcement is currently active |
| `start_date` | DateTime | When the announcement should start showing |
| `end_date` | DateTime | When the announcement should stop showing |
| `display_duration` | Number | How long the popup stays visible (milliseconds) |
| `priority` | Number | Higher numbers = higher priority |
| `target_audience` | Select | Who should see the announcement |
| `max_views_per_user` | Number | Max views per user (-1 = unlimited) |

## Usage Examples

### Welcome Message for New Visitors
```
Title: "Welcome to 101 Studios! 🎉"
Content: "Thanks for visiting! Check out our latest work and don't miss our special offers."
Target Audience: new_visitors
Max Views: 1
Display Duration: 5000ms
```

### Holiday Promotion
```
Title: "🎄 Christmas Special!"
Content: "Get 20% off all products this holiday season. Limited time offer!"
Start Date: 2026-12-01
End Date: 2026-12-31
Target Audience: all
Priority: 100
```

### Maintenance Notice
```
Title: "🔧 Quick Maintenance"
Content: "We'll be back online in 10 minutes. Thanks for your patience!"
Display Duration: 3000ms
Priority: 1000 (highest)
```

## Technical Details

### Database Schema

The system uses three main tables:
- `announcements`: Stores announcement content and settings
- `user_announcement_views`: Tracks which users have seen which announcements
- `Functions`: `get_active_announcements()` - Smart filtering function

### Live Editor Integration

The announcement management is fully integrated into your existing live content manager:
- **Same Interface**: Uses the same password and workflow
- **Content Persistence**: Saves with your other content changes
- **No Extra Setup**: Works with your existing content.json system

### User Tracking

- Uses anonymous user IDs stored in localStorage
- Tracks views to prevent showing the same announcement too many times
- Respects user privacy with no personal data collection

## Troubleshooting

### Announcements Not Showing
1. Check if `is_active` is set to true
2. Verify start/end dates are correct
3. Ensure target audience settings match
4. Check browser console for errors

### Database Errors
1. Make sure the migration has been applied
2. Verify Supabase connection
3. Check RLS policies are correct

### Live Editor Issues
1. Make sure you're using the correct password
2. Check that content.json is properly uploaded
3. Clear browser cache if changes don't appear

## Security Notes

- All database operations use Row Level Security (RLS)
- Admin-only access to management functions
- Anonymous user tracking (no personal data)
- Input validation on all forms

## Future Enhancements

- A/B testing for announcement content
- Click tracking and conversion analytics
- Advanced targeting based on user behavior
- Integration with email marketing
- Mobile push notification support