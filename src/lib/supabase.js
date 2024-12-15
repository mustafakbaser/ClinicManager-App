import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please check your .env file and ensure you have:');
  console.error('VITE_SUPABASE_PROJECT_URL and VITE_SUPABASE_API_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);