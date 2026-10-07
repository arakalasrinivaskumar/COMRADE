// src/lib/supabase.js
// Supabase client — used by Anusri for forms

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing. Copy .env.example to .env and fill in your keys.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
