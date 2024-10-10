import OpenAI from 'openai';
import { Entry } from '@/types/database.types';
import { DatabaseEntry as DatabaseEntryType } from '@/types/database.types';

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in the environment variables');
  // Instead of throwing an error, we'll use a placeholder API key
  // This is just for debugging purposes, don't use this in production
  // let apiKey = 'dummy_key';
}

// Remove the OpenAI instantiation
// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
// });

// Instead, add a function to call your API route
async function callOpenAI(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to call OpenAI API');
  }
}

// Update any functions that were using the OpenAI instance directly
// For example, if you had a function like this:
// async function parseResume(resumeText: string) {
//   const completion = await openai.chat.completions.create({...});
//   // process the completion
// }

// Add this import at the top of the file
import { DatabaseEntry as DBEntry } from '@/types/database.types';

// You would change it to:
async function parseResume(resumeText: string): Promise<DBEntry[]> {
  try {
    const prompt = `Parse the following resume and extract work history entries:\n\n${resumeText}`;
    const response = await callOpenAI(prompt);
    
    // Parse the response and convert it to DatabaseEntry[]
    // This is a placeholder implementation, adjust according to your needs
    const entries: DBEntry[] = JSON.parse(response);
    
    return entries;
  } catch (error) {
    console.error('Error parsing resume:', error);
    return []; // Return an empty array if parsing fails
  }
}

// Export the functions you need
export { parseResume };