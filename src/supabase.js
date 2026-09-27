import { createClient } from "@supabase/supabase-js";

// This is Shiftaan's own Supabase project for the blog CMS only (separate
// from app.shiftaan.com's product database). The URL + publishable key below
// are safe to ship in client-side code — that's how Supabase is designed to
// be used. Every table this key can touch is protected by Row Level Security
// policies in the database itself (see the "admin can do everything" policy
// on blog_posts, scoped to admin@shiftaan.com), not by keeping this key secret.
const SUPABASE_URL = "https://qazegonoysisqrpyeucf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_s2rK08Vjocuq5OeMWgCf7w_23gop4y0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
export const ADMIN_EMAIL = "admin@shiftaan.com";
