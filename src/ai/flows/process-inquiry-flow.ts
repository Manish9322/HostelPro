
'use server';

/**
 * @fileOverview An inquiry processing AI agent.
 *
 * - processInquiry - A function that handles student inquiries.
 * - ProcessInquiryInput - The input type for the processInquiry function.
 * - ProcessInquiryOutput - The return type for the processInquiry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { InventoryItem } from '@/lib/types';

export const ProcessInquiryInputSchema = z.object({
  subject: z.string().describe('The subject line of the inquiry.'),
  text: z.string().describe('The full text of the inquiry or request.'),
  availableItems: z.array(z.string()).describe('A list of inventory items available for request.'),
});
export type ProcessInquiryInput = z.infer<typeof ProcessInquiryInputSchema>;

export const ProcessInquiryOutputSchema = z.object({
  category: z
    .enum(['Question', 'Request'])
    .describe(
      'The category of the inquiry. Is it a general question or a request for an item?'
    ),
  urgency: z
    .enum(['High', 'Medium', 'Low'])
    .describe(
      'The urgency of the inquiry.'
    ),
  summary: z.string().describe('A short summary of the inquiry.'),
  requestedItem: z.string().optional().describe('If an item was requested, specify which one from the list of available items.'),
});
export type ProcessInquiryOutput = z.infer<typeof ProcessInquiryOutputSchema>;

export async function processInquiry(
  input: ProcessInquiryInput
): Promise<ProcessInquiryOutput> {
  return processInquiryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processInquiryPrompt',
  input: {schema: ProcessInquiryInputSchema},
  output: {schema: ProcessInquiryOutputSchema},
  prompt: `You are an AI assistant for a hostel. Your job is to analyze student inquiries.

  Analyze the following inquiry and determine if it is a general 'Question' or a 'Request' for an item.
  Determine the urgency: 'High', 'Medium', or 'Low'.
  Provide a short summary.

  If the student is requesting an item, you MUST identify which item they are asking for from the provided list of available items. If the requested item is not in the list, do not populate the requestedItem field.

  Available items for request:
  {{#each availableItems}}
  - {{{this}}}
  {{/each}}

  Inquiry Subject: {{{subject}}}
  Inquiry Text: {{{text}}}
  `,
});

const processInquiryFlow = ai.defineFlow(
  {
    name: 'processInquiryFlow',
    inputSchema: ProcessInquiryInputSchema,
    outputSchema: ProcessInquiryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
