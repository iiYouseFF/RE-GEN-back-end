import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseURL = process.env.SUPABASE_URL;
// Use the secret SERVICE ROLE KEY if available so the backend can bypass RLS for administrative updates
const supabaseKey = process.env.SUPABASE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseURL || !supabaseKey) {
    throw new Error(
        'Missing Supabase credentials. Ensure SUPABASE_URL and SUPABASE_ROLE_KEY are set in your environment.'
    );
}

export const supabase = createClient(supabaseURL, supabaseKey);