'use server';

/**
 * @fileOverview Extracts a possible article link from a chat transcript using GenAI.
 *
 * - extractArticleLink - A function that extracts the article link from the chat transcript.
 * - ExtractArticleLinkInput - The input type for the extractArticleLink function.
 * - ExtractArticleLinkOutput - The return type for the extractArticleLink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractArticleLinkInputSchema = z.object({
  transcript: z.string().describe('The chat transcript between two agents.'),
});
export type ExtractArticleLinkInput = z.infer<typeof ExtractArticleLinkInputSchema>;

const ExtractArticleLinkOutputSchema = z.object({
  articleLink: z.string().describe('The extracted article link from the transcript.'),
});
export type ExtractArticleLinkOutput = z.infer<typeof ExtractArticleLinkOutputSchema>;

export async function extractArticleLink(input: ExtractArticleLinkInput): Promise<ExtractArticleLinkOutput> {
  return extractArticleLinkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractArticleLinkPrompt',
  input: {schema: ExtractArticleLinkInputSchema},
  output: {schema: ExtractArticleLinkOutputSchema},
  prompt: `You are an expert in extracting article links from chat transcripts.

  Given the following chat transcript, extract the most likely article link that the agents are discussing.
  If no link is present or can be inferred, return an empty string.

  Transcript: {{{transcript}}}
  `,
});

const extractArticleLinkFlow = ai.defineFlow(
  {
    name: 'extractArticleLinkFlow',
    inputSchema: ExtractArticleLinkInputSchema,
    outputSchema: ExtractArticleLinkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
