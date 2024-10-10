import { supabase } from './supabaseClient';
import { Database } from '../types/database.types';

export type WorkHistoryEntry = Database['public']['Tables']['work_experiences']['Insert'];

export async function saveWorkHistory(entries: WorkHistoryEntry[]) {
  try {
    const { data, error } = await supabase
      .from('work_experiences')
      .insert(entries);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error saving work history:', error);
    throw error;
  }
}
