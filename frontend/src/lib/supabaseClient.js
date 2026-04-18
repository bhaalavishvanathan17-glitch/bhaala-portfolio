import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL  || null;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || null;

// Only initialise when env vars are present (avoids crash during local dev without .env)
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;
