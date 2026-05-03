import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
let url = "https://placeholder.supabase.co";
let key = "placeholder";

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envFile.match(/VITE_SUPABASE_URL=(.*)/);
  const keyMatch = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
  if (urlMatch) url = urlMatch[1].trim();
  if (keyMatch) key = keyMatch[1].trim();
}

const supabase = createClient(url, key);

async function test() {
  const { data: apps, error: fetchError } = await supabase.from("applications").select("*").limit(1);
  console.log("Fetch Error:", fetchError);
  if (!apps || apps.length === 0) {
      console.log("No applications found to test delete.");
      return;
  }
  const app = apps[0];
  console.log("Application columns:", Object.keys(app));
  
  const { data, error } = await supabase.from("applications").update({
      stage_history: []
  }).eq("id", app.id);
  console.log("Update stage_history Error:", error);
}
test();
