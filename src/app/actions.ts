'use server';

import { suggestTripPurpose } from '@/ai/flows/suggest-trip-purpose';
import { askHelpBotFlow } from '@/ai/flows/ask-help-bot-flow';
import type { Trip } from '@/lib/types';
import { tripPurposes } from '@/lib/types';

export async function getAiTripPurposeSuggestion(
  tripHistory: Trip[],
  currentLocation: string
): Promise<{ suggestedPurpose: string; confidence: number }> {
  try {
    const response = await suggestTripPurpose({
      tripHistory: JSON.stringify(tripHistory.slice(-5)), // Send recent history
      currentLocation: JSON.stringify({ name: currentLocation }),
    });

    // Ensure the suggested purpose is one of the valid enum values
    const suggested = response.suggestedPurpose.toLowerCase();
    if (tripPurposes.some(p => p === suggested)) {
        return response;
    }

    // Fallback if AI gives an invalid purpose
    return { suggestedPurpose: 'leisure', confidence: 0.5 };
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    // Return a default or error state
    return { suggestedPurpose: 'leisure', confidence: 0 };
  }
}

export async function askHelpBot(history: string, question: string): Promise<string> {
  try {
    const response = await askHelpBotFlow({ history, question });
    return response;
  } catch (error) {
    console.error('Error in askHelpBot:', error);
    return "I'm sorry, but I encountered an error. Please try again.";
  }
}
