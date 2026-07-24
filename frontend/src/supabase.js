import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tznskomhzwgpymxfnmrp.supabase.co";
const supabaseKey = "sb_publishable_VKPdzGdhH0iKJthcZxMprQ_kLgRMQoj";

export const supabase = createClient(supabaseUrl, supabaseKey);