import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveWorkHistory(entries) {
  try {
    const { data, error } = await supabase
      .from('work_history')
      .insert(entries);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving work history:', error);
    throw error;
  }
}