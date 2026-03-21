# 🚀 Deploy to Vercel (Recommended)

## Step 1: Create Vercel Account
1. Go to: https://vercel.com/
2. Sign up with GitHub, GitLab, or email
3. Connect your GitHub account

## Step 2: Deploy Your Website
1. Click **"New Project"** in Vercel dashboard
2. Import your Git repository (or upload files)
3. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

## Step 3: Add Environment Variables (Optional)
If you want to use Supabase later:
- Go to Project Settings → Environment Variables
- Add: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

## Step 4: Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Your site will be live at: `https://your-project-name.vercel.app`

---

# 🌐 Deploy to Netlify

## Step 1: Create Netlify Account
1. Go to: https://netlify.com/
2. Sign up with GitHub, GitLab, or email

## Step 2: Deploy Your Website
1. Click **"Add new site"** → **"Import an existing project"**
2. Connect your Git repository
3. Configure build settings:
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

## Step 3: Deploy
- Click **"Deploy site"**
- Wait 2-3 minutes
- Your site will be live at: `https://random-name.netlify.app`

---

# 🔄 Making Changes When Live

## Method 1: Edit Files & Redeploy (Simple)
1. Edit `public/content.json` with your content
2. Commit and push to Git
3. Vercel/Netlify will auto-redeploy
4. Changes live in 2-3 minutes

## Method 2: Live Content Editor (Advanced)
I'll create a live content management system for you!

---

# ⚙️ Custom Domain (Optional)

## On Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## On Netlify:
1. Site Settings → Domain management
2. Add custom domain
3. Update DNS as instructed

---

# 📱 Mobile Preview
Both platforms let you preview your site on mobile devices before going live.

---

# 🎯 Which One to Choose?

**Vercel** (Recommended):
- ✅ Faster deployments
- ✅ Better for React/Vite projects
- ✅ More reliable
- ✅ Free tier is generous

**Netlify**:
- ✅ Great for static sites
- ✅ Excellent form handling
- ✅ Good for beginners

**I recommend Vercel for your project!**