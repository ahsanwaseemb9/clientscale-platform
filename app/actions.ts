'use server';

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import 'dotenv/config';

export async function handleAuditSubmit(formData: FormData) {
  const rawUrl = formData.get('url') as string;
  if (!rawUrl) return;

  const cleanUrl = rawUrl
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');

  // Using hard-coded keys to bypass environment variable loading issues
  const supabaseUrl = 'https://dcjjbebsydbzerzxdjcx.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log("Attempting to insert into site_audits...");
  
  const { data, error } = await supabase
    .from('site_audits')
    .insert([
      {
        target_url: cleanUrl,
        // Default values to satisfy potential NOT NULL constraints
        business_name: 'Pending Audit',
        contact_email: 'n/a'
      }
    ])
    .select();

  if (error) {
    console.error('❌ Supabase Insert Error:', error);
  } else {
    console.log('✅ Success! Data inserted:', data);
    // Route the user
    redirect(`/audit?url=${encodeURIComponent(cleanUrl)}`);
  }
}