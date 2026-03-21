# How to Update Your Website Content (No Coding Required!)

## 🎯 **EASIEST Method: Visual Editor (Recommended for Beginners)**

### Step 1: Open the Visual Editor
- Open `public/editor.html` in your web browser
- Or go to: `http://localhost:8082/editor.html` (when your site is running)

### Step 2: Add/Edit Content
- Use the forms to add portfolio items, products, updates, and videos
- Fill in the text boxes - no coding required!
- Click the **+ Add** buttons to add new items
- Click **Delete** to remove items

### Step 3: Save Your Changes
- Click the **"💾 Save All Changes"** button
- Download the new `content.json` file
- Replace the old `public/content.json` file with the downloaded one
- Refresh your website - changes appear immediately!

---

## 📝 **Alternative: Edit JSON File Directly**

If you prefer editing text files:

### Step 1: Open the File
- Open the `public/content.json` file in any text editor
- The file contains your website content in a simple format

### Step 2: Add/Edit Content

#### **Portfolio Items:**
```json
{
  "portfolio": [
    {
      "id": "1",
      "title": "Your Project Title",
      "description": "Description of your work",
      "image_url": "https://example.com/image.jpg"
    }
  ]
}
```

#### **Products:**
```json
{
  "products": [
    {
      "id": "1",
      "title": "Product Name",
      "description": "Product description",
      "price": 29.99,
      "image_url": "https://example.com/product.jpg"
    }
  ]
}
```

#### **Updates/News:**
```json
{
  "updates": [
    {
      "id": "1",
      "title": "News Title",
      "content": "News content here",
      "created_at": "2026-03-20T10:00:00Z"
    }
  ]
}
```

#### **Videos:**
```json
{
  "videos": [
    {
      "id": "1",
      "title": "Video Title",
      "url": "https://www.youtube.com/watch?v=VIDEO_ID",
      "platform": "youtube"
    }
  ]
}
```

### Step 3: Save and Refresh
- Save the file
- Refresh your website in the browser
- Your changes will appear immediately!

---

## 🔧 **Advanced: Using Supabase Admin Panel (Optional)**

If you want to use the admin panel later:

1. Go to `/admin` in your browser
2. Sign up with any email/password
3. The first user automatically becomes admin
4. Use the admin panel to add/edit content

---

## 📋 **Current Content Structure:**

Your `content.json` currently has:
- **Portfolio**: Graphic design projects
- **Products**: Tech gadgets for sale
- **Updates**: Latest news/announcements
- **Videos**: YouTube/TikTok videos

---

## ⚠️ **Important Notes:**

- Always keep the JSON format correct (commas, quotes, brackets)
- Use a text editor that shows line numbers
- Test your changes by refreshing the website
- Make backups of the file before editing
- Image URLs should be full web addresses (https://...)

---

## 🆘 **Need Help?**

If you break the JSON format:
1. Check for missing commas or quotes
2. Use an online JSON validator
3. Or just copy the working format from above

**That's it! No coding knowledge required!** 🎉