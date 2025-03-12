const { createClient } = supabase;

// Replace with your Supabase Project URL and Anon Key
const supabaseUrl = "https://ftwgddzkcucwensbcnap.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0d2dkZHprY3Vjd2Vuc2JjbmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTExODYsImV4cCI6MjA1NzE4NzE4Nn0.QALEZDXAeH_Kzp_fii6XdCGMf0CMvxDCETdVBMquUFc";
export const client = createClient(supabaseUrl, supabaseKey);