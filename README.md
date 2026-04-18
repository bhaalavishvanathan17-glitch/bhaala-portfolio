# Bhaala Vishvanathan — Portfolio v2

Modern full-stack portfolio built with **React + Vite**, **FastAPI**, and **Supabase**.

---

## 🗂️ Folder Structure

```
BHAALA/
├── frontend/          ← React (Vite) — deploy to Netlify
│   ├── src/
│   │   ├── components/   Navbar, Hero, Skills, About, School, College, Contact, Footer
│   │   ├── pages/        Home, AboutPage, SchoolPage, CollegePage, LoginPage
│   │   ├── context/      ThemeContext, AuthContext
│   │   └── lib/          supabaseClient.js
│   ├── public/images/    All portfolio images
│   ├── .env.example
│   └── netlify.toml
├── backend/           ← FastAPI (Python) — deploy to Vercel
│   ├── main.py
│   ├── models.py
│   ├── supabase_client.py
│   ├── requirements.txt
│   ├── vercel.json
│   └── .env.example
└── (legacy HTML files kept for reference)
```

---

## 🚀 Running Locally

### Frontend
```bash
cd frontend
cp .env.example .env          # fill in your Supabase keys
npm install
npm run dev                   # http://localhost:5173
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # fill in your Supabase service key
uvicorn main:app --reload     # http://localhost:8000
```

---

## 🗄️ Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. In your project's **SQL Editor**, run:

```sql
CREATE TABLE contacts (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  message    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service read only" ON contacts
  FOR SELECT USING (auth.role() = 'service_role');
```

3. Go to **Settings → API** and copy:
   - `Project URL` → `VITE_SUPABASE_URL` & `SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY` (backend only — never expose!)

4. Go to **Authentication → Settings** → Enable email confirmations (or disable for dev)

---

## 🌐 Deploy Frontend → Netlify

1. Push `frontend/` to a GitHub repo
2. Go to [netlify.com](https://netlify.com) → **New site from Git**
3. Select your repo, set:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Add environment variables in Netlify dashboard:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_API_URL=https://your-backend.vercel.app
   ```
5. Deploy — `netlify.toml` handles SPA routing automatically ✅

---

## ⚡ Deploy Backend → Vercel

1. Push the whole repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Set **Root Directory** to `backend`
4. Add environment variables:
   ```
   SUPABASE_URL=...
   SUPABASE_SERVICE_KEY=...
   FRONTEND_URL=https://your-portfolio.netlify.app
   ```
5. Deploy — Vercel uses `vercel.json` to route all requests to `main.py` ✅
6. Copy your Vercel URL and update `VITE_API_URL` in Netlify

---

## ✨ Features

| Feature | Status |
|---|---|
| 🌙 Dark / Light mode | ✅ CSS vars + localStorage |
| 📱 Mobile responsive | ✅ Hamburger nav drawer |
| 🔐 Supabase Auth | ✅ Login + Register |
| 💬 Contact form | ✅ → saved to Supabase |
| 📄 Resume download | ✅ Add `resume.pdf` to `frontend/public/` |
| 🚀 Smooth animations | ✅ CSS keyframe stagger |
| 🎓 School & College pages | ✅ All content preserved |

---

## 📝 Adding Your Resume

Place your PDF at `frontend/public/resume.pdf` — the Hero download button will work automatically.

---

## 🔗 Update Social Links

Edit `frontend/src/components/Contact.jsx` — update the `LINKS` array with your real GitHub and LinkedIn URLs.
