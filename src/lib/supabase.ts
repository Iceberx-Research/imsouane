/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = import.meta.env;
const SUPABASE_URL = env.VITE_SUPABASE_URL ?? env.SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are not set. Supabase client is disabled.');
} else {
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      storageKey: 'sb-imsouane-auth-token',
    },
  });
}

export const supabase = client;
export const isSupabaseConfigured = client !== null;

export function requireSupabase(): SupabaseClient {
  if (!client) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return client;
}

// Utility to generate a random nickname
export function generateNickname() {
  const prefixes = ['Surfing', 'Tajine', 'Wave', 'Morocco', 'Sunrise', 'Sunset', 'Desert', 'Nomad', 'Local', 'Beach'];
  const nouns = ['Camel', 'King', 'Master', 'Finder', 'Star', 'Rider', 'Board', 'Bro', 'Sister', 'Shredder'];

  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const n = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 99) + 1;

  return `${p}${n}${num}`;
}
