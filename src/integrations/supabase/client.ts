import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fvcpymqyehknfnfwtnlc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Y3B5bXF5ZWhrbmZuZnd0bmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwOTY3NDksImV4cCI6MjA4NDY3Mjc0OX0.pCPfTUIKk41tOEbwzervAkcKrZIFkv-DjfyZJwOJf-k";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
