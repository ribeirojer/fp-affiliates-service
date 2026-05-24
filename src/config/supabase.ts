import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";
import env from "./env.ts";

const supabaseUrl = env.SUPABASE_URL || Deno.env.get("SUPABASE_URL");
const supabaseKey = env.SUPABASE_KEY || Deno.env.get("SUPABASE_KEY");

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not defined in .env");
}

if (!supabaseKey) {
  throw new Error("SUPABASE_KEY is not defined in .env");
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export { supabase };
