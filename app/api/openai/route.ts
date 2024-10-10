import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

export async function GET(request: Request) {
    // Your logic for handling the GET request
    const data = { message: "GET request successful" }; // Example response data
    return new Response(JSON.stringify(data), { status: 200 }); // Ensure a Response is returned
}

// Add other HTTP methods as needed
export async function POST(request: Request) {
    // Your logic for handling the POST request
    const data = { message: "POST request successful" }; // Example response data
    return new Response(JSON.stringify(data), { status: 201 }); // Ensure a Response is returned
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;
        const response = await openai.completions.create({
            model: "gpt-3.5-turbo",
            prompt: prompt,
            max_tokens: 150,
        });

        res.status(200).json({ result: response.choices[0].text }); // Adjusted to match response structure
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ message: 'Error calling OpenAI API', error: (error as Error).message });
    }
}