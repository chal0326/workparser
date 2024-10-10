"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseResume } from '@/lib/resumeParser';
import { WorkHistoryEntry, saveWorkHistory } from '@/lib/supabase';
import { Entry as DatabaseEntry } from '/Users/codyhall/workparser/types/database.types';

// Update the Entry type to match the database schema
type Entry = {
    job_title: string | null;
    company: string | null;
    start_date: string | null;
    end_date: string | null;
    description: string | null
};

export default function WorkHistoryForm() {
  const [resumeText, setResumeText] = useState('');
  const [parsedEntries, setParsedEntries] = useState<DatabaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const entries = await parseResume(resumeText);
      setParsedEntries(entries.map(entry => ({
        job_title: entry.position || '', // Updated to match DatabaseEntry
        company: entry.company,
        start_date: entry.startDate || '', // Added to match Entry type
        end_date: entry.endDate || '',     // Added to match Entry type
        description: entry.description || '' // Added to match Entry type
      })));
    } catch (error) {
      console.error('Error parsing resume:', error);
      // Optionally, set an error state or show an error message to the user
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const workHistoryEntries: WorkHistoryEntry[] = parsedEntries.map(entry => ({
        id: '', // Add an empty string for the id field
        job_title: entry.job_title,
        company: entry.company,
        start_date: entry.start_date,
        end_date: entry.end_date,
    }));

    try {
      await saveWorkHistory(workHistoryEntries);
      alert('Work history saved successfully!');
      // TODO: Handle saving skills separately if needed
    } catch (error) {
      console.error('Error saving work history:', error);
      alert('Error saving work history. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="resumeText">Paste your resume here:</Label>
        <Textarea
          id="resumeText"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={10}
          className="w-full"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Parsing...' : 'Parse Resume'}
      </Button>

      {parsedEntries.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Parsed Work History</h2>
          {parsedEntries.map((entry, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <Input
                value={entry.job_title || ''}
                onChange={(e) => {
                  const updatedEntries = [...parsedEntries];
                  updatedEntries[index].job_title = e.target.value;
                  setParsedEntries(updatedEntries);
                }}
                className="mb-2"
                placeholder="Job Title"
              />
              <Input
                value={entry.company || ''}
                onChange={(e) => {
                  const updatedEntries = [...parsedEntries];
                  updatedEntries[index].company = e.target.value;
                  setParsedEntries(updatedEntries);
                }}
                className="mb-2"
                placeholder="Company"
              />
              <Input
                value={entry.start_date ?? ''}
                onChange={(e) => {
                  const updatedEntries = [...parsedEntries];
                  updatedEntries[index].start_date = e.target.value;
                  setParsedEntries(updatedEntries);
                }}
                className="mb-2"
                placeholder="Start Date"
              />
              <Input
                value={entry.end_date ?? ''}
                onChange={(e) => {
                  const updatedEntries = [...parsedEntries];
                  updatedEntries[index].end_date = e.target.value;
                  setParsedEntries(updatedEntries);
                }}
                className="mb-2"
                placeholder="End Date"
              />
              <Textarea
                value={entry.description ?? ''}
                onChange={(e) => {
                  const updatedEntries = [...parsedEntries];
                  updatedEntries[index].description = e.target.value;
                  setParsedEntries(updatedEntries);
                }}
                className="mb-2"
                placeholder="Description"
              />
            </div>
          ))}
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Work History'}
          </Button>
        </div>
      )}
    </form>
  );
}