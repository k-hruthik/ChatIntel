// This is an API route, mark with 'use server'
'use server';

/**
 * @fileOverview AI agent that analyzes the sentiment of agents in a chat transcript.
 *
 * - analyzeAgentSentiment - A function that analyzes the sentiment of agents in a chat transcript.
 * - AnalyzeAgentSentimentInput - The input type for the analyzeAgentSentiment function.
 * - AnalyzeAgentSentimentOutput - The return type for the analyzeAgentSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAgentSentimentInputSchema = z.object({
  transcript: z.array(
    z.object({
      message: z.string(),
      agent: z.string(),
    })
  ).describe('The chat transcript between two agents.'),
});

export type AnalyzeAgentSentimentInput = z.infer<typeof AnalyzeAgentSentimentInputSchema>;

const AnalyzeAgentSentimentOutputSchema = z.object({
  agent1Sentiment: z.string().describe('The overall sentiment of agent 1.'),
  agent2Sentiment: z.string().describe('The overall sentiment of agent 2.'),
});

export type AnalyzeAgentSentimentOutput = z.infer<typeof AnalyzeAgentSentimentOutputSchema>;

export async function analyzeAgentSentiment(input: AnalyzeAgentSentimentInput): Promise<AnalyzeAgentSentimentOutput> {
  return analyzeAgentSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAgentSentimentPrompt',
  input: {schema: AnalyzeAgentSentimentInputSchema},
  output: {schema: AnalyzeAgentSentimentOutputSchema},
  prompt: `You are an AI expert in analyzing chat transcripts to determine the sentiment of each agent involved.

  Analyze the following chat transcript and determine the overall sentiment of agent 1 and agent 2.

  Transcript:
  {{#each transcript}}
  {{agent}}: {{message}}
  {{/each}}

  Agent 1 Sentiment: {{{agent1Sentiment}}}
  Agent 2 Sentiment: {{{agent2Sentiment}}}`,
});

const analyzeAgentSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeAgentSentimentFlow',
    inputSchema: AnalyzeAgentSentimentInputSchema,
    outputSchema: AnalyzeAgentSentimentOutputSchema,
  },
  async input => {
    const agent1Messages = input.transcript.filter(message => message.agent === 'agent_1').map(message => message.message).join('\n');
    const agent2Messages = input.transcript.filter(message => message.agent === 'agent_2').map(message => message.message).join('\n');

    const agent1SentimentResult = await ai.generate({
      prompt: `Determine the sentiment of the following messages:
${agent1Messages}`,
    });

    const agent2SentimentResult = await ai.generate({
      prompt: `Determine the sentiment of the following messages:
${agent2Messages}`,
    });


    return {
      agent1Sentiment: agent1SentimentResult.text,
      agent2Sentiment: agent2SentimentResult.text,
    };
  }
);
