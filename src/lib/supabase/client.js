import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

const supabaseClient = createClient(supabaseUrl, supabaseKey);

export const supabase = {
  ...supabaseClient,
  async signInWithMagicLink(email) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithMagicLink({
        email,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },
  async signUp(email, password) {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },
};