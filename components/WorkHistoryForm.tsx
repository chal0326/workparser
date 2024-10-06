"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseResume } from '@/lib/resumeParser';
import { saveWorkHistory } from '@/lib/supabase';

export default function WorkHistoryForm() {
  const [resumeText, setResumeText] = useState('');
  const [parsedEntries, setParsedEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const entries = await parseResume(resumeText);
      setParsedEntries(entries);
    } catch (error) {
      console.error('Error parsing resume:', error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveWorkHistory(parsedEntries);
      alert('Work history saved successfully!');
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
                value={entry.jobTitle}
                onChange={(e) => {
                  const updatedEntries = [...parsedEntries];
                  updatedEntries[index].jobTitle = e.target.value;
                  setParsedEntries(updatedEntries);
                }}
                className="mb-2"
                placeholder="Job Title"
              />
              <Input
                value={entry.company}
                onChange={(e) => {
                  const updatedEntries = [...parsedEntries];
                  updatedEntries[index].company = e.target.value;
                  setParsedEntries(updatedEntries);
                }}
                className="mb-2"
                placeholder="Company"
              />
              <Input
                value={entry.startDate}
                onChange={(e) => {
                  const updatedEntries = [...parsedEntries];
                  updatedEntries[index].startDate = e.target.value;
                  setParsedEntries(updatedEntries);
                }}
                className="mb-2"
                placeholder="Start Date"
              />
              <Input
                value={entry.endDate}
                onChange={(e) => {
                  const updatedEntries = [...parsedEntries];
                  updatedEntries[index].endDate = e.target.value;
                  setParsedEntries(updatedEntries);
                }}
                className="mb-2"
                placeholder="End Date"
              />
              <Textarea
                value={entry.description}
                onChange={(e) => {
                  const updatedEntries = [...parsedEntries];
                  updatedEntries[index].description = e.target.value;
                  setParsedEntries(updatedEntries);
                }}
                className="mb-2"
                placeholder="Description"
              />
              <Input
                value={entry.skill}
                onChange={(e) => {
                  const updatedEntries = [...parsedEntries];
                  updatedEntries[index].skill = e.target.value;
                  setParsedEntries(updatedEntries);
                }}
                className="mb-2"
                placeholder="Suggested Skill"
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