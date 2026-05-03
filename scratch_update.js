import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "placeholder";

// Read from .env if we can
import fs from 'fs';
const envPath = path.resolve('.env');
let url = supabaseUrl;
let key = supabaseKey;
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envFile.match(/VITE_SUPABASE_URL=(.*)/);
  const keyMatch = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
  if (urlMatch) url = urlMatch[1].trim();
  if (keyMatch) key = keyMatch[1].trim();
}

const supabase = createClient(url, key);

async function test() {
  const { data: fetchdata } = await supabase.from("applications").select("id").limit(1);
  if (!fetchdata || fetchdata.length === 0) {
     console.log("No applications found to test update.");
     return;
  }
  const id = fetchdata[0].id;
  const { data, error } = await supabase.from("applications").update({
      stage: "applied",
      stage_history: []
  }).eq("id", id);
  console.log("Error:", error);
}
test();
