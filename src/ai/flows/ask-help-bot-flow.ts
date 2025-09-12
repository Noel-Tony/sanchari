'use server';

/**
 * @fileOverview A chatbot flow for the help section.
 *
 * - askHelpBotFlow - A function that answers user questions about the app.
 * - AskHelpBotInput - The input type for the askHelpBotFlow function.
 * - AskHelpBotOutput - The return type for the askHelpBotFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AskHelpBotInputSchema = z.object({
  history: z.string().describe('The chat history as a string.'),
  question: z.string().describe('The user\'s current question.'),
});
export type AskHelpBotInput = z.infer<typeof AskHelpBotInputSchema>;

export type AskHelpBotOutput = string;

export async function askHelpBotFlow(input: AskHelpBotInput): Promise<AskHelpBotOutput> {
  const prompt = ai.definePrompt({
    name: 'askHelpBotPrompt',
    input: { schema: AskHelpBotInputSchema },
    prompt: `You are a helpful assistant for an application called "TripMapper".
Your goal is to answer user questions about how to use the application.
Be friendly and concise.

The application has the following features:
- Users can track their trips (start and stop).
- After a trip, they provide details: purpose (work, school, shopping, leisure), mode of transport (walking, cycling, vehicle), and number of co-travellers.
- The app has a dashboard to start/stop trips and see today's trips.
- A history page shows all past trips.
- A statistics page shows aggregates like total trips, distance, and time.
- An admin user can see all trips from all users and export them to CSV.
- The app requires user consent for location tracking after login.
- Users can toggle location tracking on the dashboard.

Based on the provided chat history and the user's question, provide a helpful response.

Chat History:
{{{history}}}

User Question:
{{{question}}}
`,
  });

  const { output } = await prompt(input);
  return output!;
}
