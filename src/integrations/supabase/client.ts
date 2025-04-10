
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://myvoecxoicxhklaxvgdi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15dm9lY3hvaWN4aGtsYXh2Z2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTc3OTIsImV4cCI6MjA1NjY5Mzc5Mn0.XWLoIGayQvzdyQlFi8v9ziM991Xt44uOFT3FL58RkP8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Type-safe helper for working with dynamic table names
export const fromTable = <T = any>(table: keyof Database['public']['Tables'] | string) => {
  return supabase.from(table as any) as any;
};
