import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log("URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log("KEY:", process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase Environment Variables");
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
