# 🎨 Complete Website Customization Guide

## 📞 Contact Information Setup

### Step 1: Update Phone Number & Email
Open these files and replace the placeholder values:

#### **ShopSection.tsx** (for WhatsApp checkout)
```typescript
// Line 14 in src/components/ShopSection.tsx
const WHATSAPP_NUMBER = "1234567890"; // Replace with your number
```
**Change to:**
```typescript
const WHATSAPP_NUMBER = "YOUR_PHONE_NUMBER"; // e.g., "1234567890"
```

#### **ContactSection.tsx** (for contact form)
```typescript
// Lines 4-5 in src/components/ContactSection.tsx
const WHATSAPP_NUMBER = "1234567890";
const EMAIL = "hello@example.com";
```
**Change to:**
```typescript
const WHATSAPP_NUMBER = "YOUR_PHONE_NUMBER";
const EMAIL = "your-email@example.com";
```

### Step 2: Test Contact Links
- WhatsApp checkout will work automatically
- Email links will open user's email client

---

## 🎨 Customize Colors & Theme

### Step 1: Primary Colors
Edit `tailwind.config.ts`:
```typescript
// Around line 10-15
colors: {
  primary: {
    DEFAULT: "hsl(var(--primary))", // Main brand color
    foreground: "hsl(var(--primary-foreground))",
  },
  // Add your custom colors here
}
```

### Step 2: CSS Variables
Edit `src/index.css`:
```css
:root {
  --primary: 262 83% 58%;     /* Purple - change this */
  --secondary: 210 40% 96%;   /* Light blue */
  --accent: 210 40% 96%;      /* Light blue */
  --background: 222 84% 4.9%; /* Dark background */
  --foreground: 210 40% 98%; /* Light text */
}
```

### Step 3: Dark/Light Mode
The site already supports both! Users can toggle with their system settings.

---

## 📝 Customize Text Content

### Hero Section
Edit `src/components/HeroSection.tsx`:
- Change the main heading, subtitle, and call-to-action text

### About/Portfolio Section
Edit `src/components/PortfolioSection.tsx`:
- Change section title and description

### Shop Section
Edit `src/components/ShopSection.tsx`:
- Change section title and description

### Updates Section
Edit `src/components/UpdatesSection.tsx`:
- Change section title and description

### Contact Section
Edit `src/components/ContactSection.tsx`:
- Change section title and description

---

## 🖼️ Customize Images & Assets

### Logo/Icon
Replace `public/favicon.ico` and update in `index.html`

### Background Images
Add to `public/images/` and reference in components

### Social Media Icons
Update links in footer or navbar

---

## 🎯 Customize Layout & Sections

### Add/Remove Sections
Edit `src/pages/Index.tsx`:
```typescript
// Add or remove components here
<main>
  <HeroSection />
  <PortfolioSection />
  <ShopSection />
  <UpdatesSection />
  <VideosSection />
  <ContactSection />
</main>
```

### Section Order
Reorder the components in `Index.tsx`

### Hide Sections
Comment out components you don't want:
```typescript
{/* <VideosSection /> */}
```

---

## 📱 Customize Mobile Experience

### Responsive Design
The site is already mobile-friendly! Test on different screen sizes.

### Touch Interactions
- Cards have hover effects that work on mobile
- Buttons have proper touch targets

---

## 🚀 Advanced Customizations

### Add New Pages
1. Create new component in `src/components/`
2. Add route in `src/App.tsx`
3. Add navigation link

### Custom Animations
Edit `src/hooks/useScrollReveal.ts` for scroll animations

### Forms & Interactions
Add contact forms, newsletter signup, etc.

---

## 🎨 Design System

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Sizes**: Responsive scaling

### Spacing
- **Section padding**: `section-padding` class
- **Container**: `max-w-7xl mx-auto`
- **Cards**: `glass-card` class

### Components
- **Buttons**: `btn-primary`, `btn-secondary`
- **Cards**: `glass-card`, `glass-card-hover`
- **Inputs**: Styled form elements

---

## 🔧 Technical Customizations

### Build Process
- **Framework**: Vite + React
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: React hooks

### Performance
- **Images**: Optimized with lazy loading
- **Bundle**: Code splitting enabled
- **Caching**: Proper cache headers

---

## 📚 File Structure Guide

```
src/
├── components/          # Reusable UI components
│   ├── HeroSection.tsx     # Main hero/banner
│   ├── PortfolioSection.tsx # Work showcase
│   ├── ShopSection.tsx     # Products for sale
│   ├── UpdatesSection.tsx  # News/announcements
│   ├── VideosSection.tsx   # Video content
│   ├── ContactSection.tsx  # Contact info
│   ├── Navbar.tsx         # Navigation
│   └── Footer.tsx         # Footer
├── pages/               # Page components
│   ├── Index.tsx           # Home page
│   └── Admin.tsx          # Admin panel
├── hooks/               # Custom React hooks
├── lib/                 # Utilities
└── integrations/        # External services

public/
├── content.json         # Your content data
├── editor.html          # Visual content editor
└── images/             # Image assets
```

---

## 🎯 Quick Customization Checklist

### Essential Changes:
- [ ] Update contact info (phone/email)
- [ ] Add your content via `editor.html`
- [ ] Customize colors in `tailwind.config.ts`
- [ ] Update text in component files
- [ ] Add your images

### Optional Enhancements:
- [ ] Add custom domain
- [ ] Set up analytics
- [ ] Add social media links
- [ ] Customize footer
- [ ] Add loading animations

---

## 🆘 Need Help?

### Common Issues:
1. **Colors not changing**: Clear browser cache (Ctrl+F5)
2. **Images not showing**: Check URLs are correct
3. **Mobile issues**: Test in browser dev tools
4. **Build errors**: Check console for TypeScript errors

### Resources:
- **Tailwind Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

## 🚀 Deployment & Maintenance

### After Customization:
1. Test locally: `npm run dev`
2. Build for production: `npm run build`
3. Deploy to Vercel/Netlify
4. Update content via `content.json` or redeploy

### Live Updates:
- Edit `public/content.json`
- Commit and push to Git
- Auto-deploy updates the site

---

## ✨ Pro Tips

1. **Version Control**: Use Git for all changes
2. **Backup**: Keep copies of working versions
3. **Test**: Always test on mobile and desktop
4. **Performance**: Compress images before uploading
5. **SEO**: Update meta tags in `index.html`

**Your website is now fully customizable! 🎉**