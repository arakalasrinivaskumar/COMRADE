# COMRADE – Minimal React + Supabase Demo

## Overview
A small Vite‑React app that demonstrates:
- **Join** and **Contact** forms storing data in Supabase tables (`join_comrade`, `contact`).
- **Auth** page with email/password registration and login.
- **Welcome e‑mail** sent to the newly registered user via a Supabase Edge Function (`send-email`).
- **Admin notification** e‑mail sent on every login/registration.

The UI is deliberately simple, using a few CSS variables for a light theme.

## Project Structure
```
comrade-website/
├─ src/
│  ├─ App.jsx          # Router + Home page
│  ├─ App.css          # Global CSS + spinner
│  ├─ index.css        # Empty placeholder imported by main.jsx
│  ├─ main.jsx         # React entry point
│  ├─ lib/
│  │   └─ supabase.js  # Supabase client wrapper
│  └─ pages/
│      ├─ Join.jsx
│      ├─ Contact.jsx
│      └─ Auth.jsx      # Login / Register with welcome e‑mail
├─ supabase/
│   └─ functions/
│        └─ send-email/
│            └─ index.ts   # Edge function that forwards to SendGrid
├─ .env               # **Do not commit** – runtime values
├─ .env.example       # Template for new developers
├─ package.json
└─ vite.config.js
```

## Prerequisites
- **Node.js ≥ 18**
- **npm** (or Yarn/pnpm)
- A **Supabase** project (sign‑up at https://supabase.com)
- A **SendGrid** account (or any transactional e‑mail provider) – you only need the API key.

## Setup (development)
1. **Clone the repository**
   ```bash
   git clone <repo‑url>
   cd comrade-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** based on the template:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in:
   ```dotenv
   VITE_SUPABASE_URL=https://<your‑project>.supabase.co
   VITE_SUPABASE_ANON_KEY=your‑anon‑public‑key
   VITE_ADMIN_EMAIL=admin@example.com   # where admin notifications go
   ```

4. **Configure Supabase Auth**
   - In the Supabase dashboard go to **Authentication → Settings**.
   - Enable **Email sign‑ups**.
   - Add `http://localhost:5173` to **Redirect URLs** (you can add your production URL later).

5. **Create tables** (if not already present). Run the following SQL in Supabase SQL editor:
   ```sql
   create table if not exists join_comrade (
       id uuid default uuid_generate_v4() primary key,
       name text not null,
       email text not null unique,
       created_at timestamp with time zone default now()
   );

   create table if not exists contact (
       id uuid default uuid_generate_v4() primary key,
       name text not null,
       email text not null,
       message text not null,
       created_at timestamp with time zone default now()
   );
   ```
   Ensure Row‑Level Security is enabled and add an `INSERT` policy for the `anon` role.

6. **Deploy the Edge Function**
   - In Supabase dashboard → **Functions → Create a new function** > name it `send-email`.
   - Paste the contents of `supabase/functions/send-email/index.ts` (already in the repo).
   - Add a secret called `SENDGRID_API_KEY` containing your SendGrid API key.
   - Deploy the function.
   - (Optional) Test it via the dashboard’s **Invoke** tab with a payload like:
     ```json
     {"to":"you@example.com","subject":"Test","message":"Hello from COMRADE"}
     ```

7. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open <http://localhost:5173> and you should see the Home page.

## Using the app
- **Join** → fills `join_comrade` table.
- **Contact** → fills `contact` table.
- **Login / Register**
  - Registering a new e‑mail sends a **welcome e‑mail** to that address **and** notifies the admin.
  - Trying to register an already‑used e‑mail shows a friendly error.
  - Logging in sends an admin notification.

## Production build & deployment
1. **Build** the static assets:
   ```bash
   npm run build
   ```
   The output is in `dist/`.
2. **Deploy** `dist/` to any static‑host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.).
3. **Set environment variables** on the host (same three `VITE_` variables as in `.env`).
4. **Update Supabase Auth redirect URLs** to include your production URL (e.g., `https://my‑app.vercel.app`).
5. **Edge Function** works unchanged – it’s hosted by Supabase, not the static site.

## FAQ
- **Why is there an `index.css` file?** Vite’s default template imports it from `main.jsx`. It can stay empty or hold global resets.
- **Can I use another e‑mail provider?** Yes – replace the SendGrid request in `supabase/functions/send-email/index.ts` with your provider’s API, keeping the same JSON shape (`to`, `subject`, `message`).
- **Do I need to commit `.env`?** **No** – it contains secrets. Only commit `.env.example`.

---
*Happy coding!*
