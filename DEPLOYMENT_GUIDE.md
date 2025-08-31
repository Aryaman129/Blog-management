# Deployment Guide: Free Hosting Options

## Option 1: Supabase (Recommended - 100% Free)

### Benefits
- ✅ $0/month forever for small projects
- ✅ 500MB PostgreSQL database
- ✅ 50,000 monthly active users
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ Storage for files
- ✅ Edge functions for API

### Migration Steps

#### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project (free tier)
3. Note your project URL and anon key

#### Step 2: Migrate Database Schema
```sql
-- Create tables in Supabase SQL editor
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  tech_stack TEXT[],
  github_url VARCHAR,
  live_url VARCHAR,
  image_url VARCHAR,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read published posts" ON blog_posts 
  FOR SELECT USING (published = true);

CREATE POLICY "Public can read projects" ON projects 
  FOR SELECT USING (true);
```

#### Step 3: Update Frontend for Supabase
```bash
npm install @supabase/supabase-js
```

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

```typescript
// Update src/lib/api.ts to use Supabase
import { supabase } from './supabase'

export const api = {
  // Blog posts
  async getBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getBlogPost(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data
  },

  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Auth
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}
```

#### Step 4: Deploy Frontend to Vercel
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Add environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Deploy automatically

---

## Option 2: Keep Current Architecture - Fly.io (~$3/month)

### Benefits
- ✅ No code changes needed
- ✅ Supports SQLite natively
- ✅ Very affordable (~$3-4/month)
- ✅ Great for small apps

### Deployment Steps

#### Step 1: Install Fly CLI
```bash
# Install Fly CLI
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

#### Step 2: Setup Backend for Fly
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
```

```toml
# backend/fly.toml
app = "your-app-name-backend"
primary_region = "iad"

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256

[mounts]
  source = "data"
  destination = "/app/data"
```

#### Step 3: Deploy to Fly
```bash
cd backend
fly launch
fly deploy
```

#### Step 4: Deploy Frontend to Vercel
Same as Option 1, but with different API URL:
```
VITE_API_URL=https://your-app-name-backend.fly.dev/api
```

---

## Option 3: Completely Free Hybrid

### Architecture
- **Frontend**: Vercel (free)
- **Backend**: Convert to Vercel serverless functions
- **Database**: Supabase free tier

### Steps
1. Convert your Express routes to Vercel API routes
2. Replace SQLite with Supabase
3. Deploy everything to Vercel

---

## Cost Comparison

| Option | Monthly Cost | Database | Changes Required |
|--------|-------------|----------|------------------|
| **Supabase** | $0 | PostgreSQL | Medium (DB migration) |
| **Fly.io** | ~$3-4 | SQLite | Minimal (Docker) |
| **Hybrid** | $0 | PostgreSQL | High (Serverless) |

## Recommendation

For your portfolio/blog app, I recommend **Supabase** because:
1. ✅ Completely free for your traffic level
2. ✅ More powerful database features
3. ✅ Built-in auth simplifies your code
4. ✅ Real-time features for future enhancements
5. ✅ File storage for images
6. ✅ Excellent documentation and community
