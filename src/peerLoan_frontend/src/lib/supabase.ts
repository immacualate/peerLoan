
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Initialize the Supabase client with public keys (safe to include in code)
const supabaseUrl = 'https://mqxpnwtmugifcmwpevzs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xeHBud3RtdWdpZmNtd3BldnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI5NzE5NzYsImV4cCI6MTk5ODU0Nzk3Nn0.hfJSj1D4qYdyFDU7gojLXLNo8eFtLImZb2IZjWRBEDI';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is connected
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('students').select('count', { count: 'exact', head: true });
    return !error;
  } catch (e) {
    console.error('Error connecting to Supabase:', e);
    return false;
  }
};
