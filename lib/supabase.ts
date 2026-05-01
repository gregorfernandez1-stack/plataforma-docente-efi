import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://woykywokxejvmoiqcknq.supabase.co";
const supabaseKey = "sb_publishable_wDyW3VtKDb2a7EwWXIH5uQ_SoUi9k0Q";

export const supabase = createClient(supabaseUrl, supabaseKey);