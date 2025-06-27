// src/ai/flows/summarize-chat.ts
'use server';
/**
 * @fileOverview Summarizes a chat transcript.
 *
 * - summarizeChat - A function that takes a chat transcript and returns a summary.
 * - SummarizeChatInput - The input type for the summarizeChat function.
 * - SummarizeChatOutput - The return type for the summarizeChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeChatInputSchema = z.object({
  transcript: z.string().describe('The chat transcript to summarize.'),
});
export type SummarizeChatInput = z.infer<typeof SummarizeChatInputSchema>;

const SummarizeChatOutputSchema = z.object({
  summary: z.string().describe('A summary of the chat transcript.'),
});
export type SummarizeChatOutput = z.infer<typeof SummarizeChatOutputSchema>;

export async function summarizeChat(input: SummarizeChatInput): Promise<SummarizeChatOutput> {
  return summarizeChatFlow(input);
}

const summarizeChatPrompt = ai.definePrompt({
  name: 'summarizeChatPrompt',
  input: {schema: SummarizeChatInputSchema},
  output: {schema: SummarizeChatOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing chat transcripts between two agents.

  Given the following chat transcript, provide a concise summary of the chat.

  Chat Transcript: {{{transcript}}}

  Ensure the output is structured according to the provided schema.
`,
});

const summarizeChatFlow = ai.defineFlow(
  {
    name: 'summarizeChatFlow',
    inputSchema: SummarizeChatInputSchema,
    outputSchema: SummarizeChatOutputSchema,
  },
  async input => {
    const {output} = await summarizeChatPrompt(input);
    return output!;
  }
);
