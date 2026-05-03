import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
let url = process.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
let key = process.env.VITE_SUPABASE_ANON_KEY || "placeholder";

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
  if (fetchError) {
      console.log("Fetch Error:", fetchError);
      return;
  }
  if (!apps || apps.length === 0) {
      console.log("No applications found to test delete.");
      return;
  }
  const app = apps[0];
  console.log("Trying to update application:", app.id);
  const { data, error } = await supabase.from("applications").update({
      stage: app.stage
  }).eq("id", app.id).select();
  console.log("Update response:", { data, error });
}
test();
