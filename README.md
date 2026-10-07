# COMRADE Website

> Travel the place. Experience the place. Connect with the people experiencing it.

Built by **Sanchari** · React + Vite + Supabase

---

## Team

| Person | Role |
|---|---|
| **Srinivas** | Technical Lead — Setup, Routing, Integration, Deployment |
| **Pravallika** | Frontend — All page sections and UI |
| **Anusri** | Backend — Supabase tables and form integration |

---

## Getting Started

### Prerequisites
- Node.js v18+
- Git

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/comrade-website.git
cd comrade-website

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Open .env and fill in your Supabase URL and anon key

# 4. Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
comrade-website/
│
├── src/
│   ├── components/         ← All UI components (Pravallika)
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Features.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── WhyComrade.jsx
│   │   ├── Sanchari.jsx
│   │   ├── Contact.jsx     ← Form (Anusri connects to Supabase)
│   │   └── Footer.jsx
│   │
│   ├── pages/
│   │   └── Home.jsx        ← Composes all sections
│   │
│   ├── lib/
│   │   └── supabase.js     ← Supabase client (Anusri)
│   │
│   ├── styles/
│   │   └── global.css      ← Brand colours, typography, utilities
│   │
│   ├── assets/             ← Images and icons
│   ├── App.jsx             ← Router setup (Srinivas)
│   └── main.jsx            ← Entry point
│
├── public/
├── .env.example            ← Copy to .env — never commit .env!
├── .gitignore
├── package.json
└── README.md
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **IMPORTANT:** Never commit `.env` to GitHub. It is already in `.gitignore`.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + Vite | Frontend framework |
| React Router v7 | Page routing |
| CSS (custom) | Styling — no extra library |
| Supabase | Backend / Database |
| Vercel | Deployment |

---

## Deployment (Srinivas — Day 7)

1. Push all code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import GitHub repo
3. Add environment variables in Vercel dashboard (Settings → Environment Variables)
4. Deploy — done!

---

## Git Workflow

```bash
# Always pull before you start working
git pull origin main

# Make your changes, then:
git add .
git commit -m "feat: describe what you did"
git push origin main
```

> If there are merge conflicts, tell **Srinivas** — he will resolve them.

---

## 7-Day Timeline

| Day | Goal |
|---|---|
| Day 1 | Setup complete — React + GitHub + Supabase + folder structure |
| Day 2 | About + Features sections |
| Day 3 | How It Works + Why COMRADE |
| Day 4 | Sanchari + Contact + Footer |
| Day 5 | Responsive design + animations |
| Day 6 | Bug fixing |
| Day 7 | Deployment to Vercel |
