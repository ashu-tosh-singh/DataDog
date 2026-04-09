import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "http://localhost:54321",
  "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"
);