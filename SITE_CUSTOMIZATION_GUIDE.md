# Website Customization Guide for Non-Coders

Welcome! This guide will help you understand and customize your website without needing any coding knowledge. Your website is built with a user-friendly live editor that lets you change content, images, and text easily.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Using the Live Editor](#using-the-live-editor)
3. [Website Sections Overview](#website-sections-overview)
4. [Customizing Content](#customizing-content)
5. [Managing Images](#managing-images)
6. [Theme and Colors](#theme-and-colors)
7. [Navigation and Links](#navigation-and-links)
8. [Contact Information](#contact-information)
9. [Advanced Customization](#advanced-customization)

## Getting Started

### Accessing Your Website
- **Live Website**: Visit your main website URL
- **Live Editor**: Go to `yourwebsite.com/live-editor.html` to make changes
- **Admin Panel**: Go to `yourwebsite.com/admin` for advanced management

### Basic Concepts
- **Sections**: Different parts of your website (Hero, Portfolio, Shop, etc.)
- **Content**: Text, images, and data that make up your website
- **Live Editor**: A simple interface to edit content without coding

## Using the Live Editor

The Live Editor is your main tool for customization. Here's how to use it:

1. Go to `yourwebsite.com/live-editor.html`
2. You'll see different sections you can edit
3. Click on any item to edit its content
4. Make your changes and click "Save"
5. Changes appear immediately on your website

### Live Editor Sections

#### Hero Slider
- **What it is**: The large images and text at the top of your homepage
- **How to edit**:
  - Add new slides with images and text
  - Change titles and descriptions
  - Reorder slides
  - Delete unwanted slides

#### Portfolio Items
- **What it is**: Your work samples or projects
- **How to edit**:
  - Add new portfolio pieces
  - Change titles, descriptions, and categories
  - Update images
  - Organize by categories (Graphics Design, Flyers, Logos, etc.)

#### Products
- **What it is**: Items available for sale in your shop
- **How to edit**:
  - Add new products
  - Set prices and descriptions
  - Add product images (single or multiple)
  - Categorize products (Electronics, Clothing, etc.)
  - For clothing: add sizes array (e.g., ["Small", "Medium", "Large", "XL", "2XL", "3XL", "4XL", "5XL"])

#### Updates/News
- **What it is**: Latest news and announcements
- **How to edit**:
  - Add new updates
  - Write titles and content
  - Add images to updates
  - Set publication dates

#### Videos
- **What it is**: Video content section
- **How to edit**:
  - Add video links (YouTube, Vimeo, etc.)
  - Write descriptions
  - Organize by categories

## Website Sections Overview

### Header/Navigation
- **Logo**: Your brand name "101studios" (cannot be changed without coding)
- **Navigation Links**: Home, Portfolio, Shop, Updates, Videos, Contact
- **Theme Switcher**: Toggle between light and dark modes
- **Shopping Cart**: Shows number of items (if you have products)

### Hero Section
- **Large background images** that rotate automatically
- **Welcome text** and call-to-action buttons
- **Floating particles** for visual effect (customizable: count, size, speed, opacity)
- **"View Portfolio" and "View Shop" buttons**

#### Customizing Particles
The floating particles in the hero section can be customized by editing the `HeroSection.tsx` file:

- **Particle Count**: Change `particleCount` (default: 20)
- **Size Range**: Adjust `particleSizeMin` and `particleSizeMax` (default: 10-40px)
- **Animation Speed**: Modify `animationDurationMin` and `animationDurationMax` (default: 8-18 seconds)
- **Opacity**: Set `particleOpacity` (default: 0.4)

These settings are at the top of the `HeroSection` component.

### Portfolio Section
- **Filter buttons**: All, Graphics Design, Flyers, Logos, Banners
- **Project cards**: Show your work with images and descriptions
- **Modal popups**: Click any project to see full details

### Shop Section
- **Product categories**: All, Electronics, Clothing
- **Product cards**: Images, titles, prices, descriptions
- **Add to Cart buttons**: Let visitors purchase items
- **Shopping cart sidebar**: Appears when items are added

### Updates Section
- **News/announcements** with dates
- **Images** for each update
- **"Load More" button** to show additional updates

### Videos Section
- **Embedded videos** from YouTube/Vimeo
- **Video descriptions** and categories
- **Responsive layout** for different screen sizes

### Contact Section
- **Contact form**: Name, email, message fields
- **Complaints form**: Textarea for customer complaints (sends via email)
- **Social media links**: Icons linking to your profiles
- **Location information**: Address and contact details

### Footer
- **Copyright information**
- **Quick links** to main sections
- **Social media icons** (Instagram, Facebook, Twitter, YouTube - update URLs in Footer.tsx)

## Customizing Content

### Adding New Content
1. Open the Live Editor
2. Find the section you want to add to
3. Click "Add New" or similar button
4. Fill in the required fields (title, description, image, etc.)
5. Save your changes

### Editing Existing Content
1. Open the Live Editor
2. Click on the item you want to edit
3. Make your changes in the form
4. Click "Update" or "Save"

### Deleting Content
1. Open the Live Editor
2. Click on the item you want to delete
3. Click "Delete" or "Remove"
4. Confirm the deletion

## Managing Images

### Image Requirements
- **Formats**: JPG, PNG, GIF, WebP
- **Sizes**: 
  - Hero images: 1920x1080px or larger (wide format)
  - Portfolio/Product images: 800x600px or square
  - Update images: 600x400px
- **File size**: Keep under 2MB per image for fast loading

### Adding Images
1. In the Live Editor, find the image upload field
2. Click "Choose File" or drag and drop
3. Select your image from your computer
4. The system will upload and optimize it automatically

### Replacing Images
1. Edit the existing item
2. Upload a new image
3. The old image will be replaced

### Image Best Practices
- Use high-quality, professional images
- Ensure images are relevant to your content
- Optimize file sizes for web (use tools like TinyPNG if needed)
- Use consistent styles across similar content

## Theme and Colors

Your website uses a strict color scheme of **black, white, and orange** only.

### Available Themes
- **Light Mode**: White background, black text, orange accents
- **Dark Mode**: Black background, white text, orange accents

### Changing Themes
- Visitors can toggle between light and dark modes using the theme switcher in the navigation
- The theme preference is saved automatically

### Color Customization (Advanced)
If you need to change colors, this requires technical help:
- Contact your website developer
- Colors are defined in CSS variables
- Changes affect the entire website design

## Navigation and Links

### Navigation Menu
- Fixed at the top of the page
- Smooth scrolling to sections
- Mobile-responsive hamburger menu

### Internal Links
- All navigation links work automatically
- "View Portfolio" and "View Shop" buttons scroll to sections
- Footer links provide quick navigation

### External Links
- Social media icons in footer and contact section
- Video links in Videos section
- Can be updated through the Live Editor

## Contact Information

### Contact Form
- Collects visitor inquiries
- Fields: Name, Email, Message
- Submissions can be viewed in the Admin panel

### Contact Details
- Email address
- Phone number (if applicable)
- Physical address (if applicable)
- Business hours

### Social Media
- Links to your social profiles
- Icons automatically styled
- Add/remove through Live Editor

## Advanced Customization

### For Advanced Users (with some technical knowledge)

#### Content Management
- Use the Admin panel (`/admin`) for bulk operations
- Access database directly for complex changes
- Manage user permissions and access

#### Performance Optimization
- Image optimization happens automatically
- Monitor loading speeds
- Use browser developer tools to check performance

#### SEO and Analytics
- Meta tags can be customized in HTML files
- Add Google Analytics tracking code
- Set up search engine indexing

#### Backup and Security
- Regular backups of content and database
- SSL certificate for secure browsing
- Regular security updates

### When to Contact a Developer
- Changing the website structure or layout
- Adding new sections or features
- Complex styling changes
- Integrating third-party services
- Performance or security issues

## Troubleshooting

### Common Issues

**Changes not appearing?**
- Clear your browser cache
- Try a different browser
- Check if you're editing the correct item

**Images not uploading?**
- Check file size (under 2MB)
- Ensure correct format (JPG, PNG, etc.)
- Try a different image

**Form not working?**
- Check internet connection
- Try refreshing the page
- Contact support if persistent

**Website loading slowly?**
- Check your internet connection
- Clear browser cache
- Large images may need optimization

### Getting Help
- Check this guide first
- Review the Live Editor interface
- Contact your website developer for technical issues
- Use browser developer tools for debugging (F12 key)

## Tips for Success

1. **Keep content updated** regularly to engage visitors
2. **Use high-quality images** that represent your brand well
3. **Test your website** on different devices and browsers
4. **Backup important content** before making major changes
5. **Follow best practices** for web content and SEO

Remember, your website is a living tool that should evolve with your business. Use the Live Editor regularly to keep content fresh and engaging!</content>
<parameter name="filePath">SITE_CUSTOMIZATION_GUIDE.md