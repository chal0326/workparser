import { supabase } from './supabaseClient';

export interface WorkHistoryEntry {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  skill: string;
}

export async function saveWorkHistory(entries: WorkHistoryEntry[]) {
  try {
    const { data, error } = await supabase
      .from('work_history')
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
