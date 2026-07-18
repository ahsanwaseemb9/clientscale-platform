'use server';

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export async function handleAuditSubmit(formData: FormData) {
  const rawUrl = formData.get('url') as string;
  
  // 1. Strict URL Regex Validation (Backend Security)
  const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  
  if (!rawUrl || !urlRegex.test(rawUrl)) {
    console.error('❌ Validation Error: Invalid URL format submitted.');
    return; // Completely stops the execution right here
  }

  const cleanUrl = rawUrl
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');

  // 2. Connect to Supabase using your safe environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log("Attempting to insert into site_audits...");
  
  const { data, error } = await supabase
    .from('site_audits')
    .insert([
      {
        target_url: cleanUrl,
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