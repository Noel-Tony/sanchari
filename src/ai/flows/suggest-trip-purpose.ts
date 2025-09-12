'use server';

/**
 * @fileOverview Suggests the purpose of a trip based on past trip history and location.
 *
 * - suggestTripPurpose - A function that suggests the trip purpose.
 * - SuggestTripPurposeInput - The input type for the suggestTripPurpose function.
 * - SuggestTripPurposeOutput - The return type for the suggestTripPurpose function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTripPurposeInputSchema = z.object({
  tripHistory: z
    .string()
    .describe('The user trip history data as a JSON string.'),
  currentLocation: z
    .string()
    .describe('The current location of the user as a JSON string.'),
});
export type SuggestTripPurposeInput = z.infer<typeof SuggestTripPurposeInputSchema>;

const SuggestTripPurposeOutputSchema = z.object({
  suggestedPurpose: z
    .string()
    .describe('The suggested purpose of the trip (e.g., work, school, shopping, leisure).'),
  confidence: z
    .number()
    .describe('A confidence score (0-1) indicating the reliability of the suggestion.'),
});
export type SuggestTripPurposeOutput = z.infer<typeof SuggestTripPurposeOutputSchema>;

export async function suggestTripPurpose(input: SuggestTripPurposeInput): Promise<SuggestTripPurposeOutput> {
  return suggestTripPurposeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTripPurposePrompt',
  input: {schema: SuggestTripPurposeInputSchema},
  output: {schema: SuggestTripPurposeOutputSchema},
  prompt: `You are a trip purpose suggestion expert. Given the user's trip history and current location, suggest the most likely purpose of the current trip.

Trip History:
{{tripHistory}}

Current Location:
{{currentLocation}}

Consider factors such as the time of day, day of the week, and the user's past behavior to infer the trip purpose. Return a confidence score between 0 and 1, with 1 being the most confident.

Format your response as a JSON object:
{
  "suggestedPurpose": "<suggested purpose>",
  "confidence": <confidence score>
}
`,
});

const suggestTripPurposeFlow = ai.defineFlow(
  {
    name: 'suggestTripPurposeFlow',
    inputSchema: SuggestTripPurposeInputSchema,
    outputSchema: SuggestTripPurposeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
