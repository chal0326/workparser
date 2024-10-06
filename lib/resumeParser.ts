import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseResume(resumeText: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a resume parser. Extract work history entries from the given resume text. For each entry, provide the job title, company, start date, end date, a brief description, and suggest a single transferrable skill."
        },
        {
          role: "user",
          content: resumeText
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const parsedEntries = JSON.parse(response.choices[0].message.content);
    return parsedEntries;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
}