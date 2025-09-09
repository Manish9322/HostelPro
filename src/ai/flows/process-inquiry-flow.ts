
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

export const ProcessInquiryInputSchema = z.object({
  inquiryType: z.enum(['Question', 'Item Request', 'Room Change Request']),
  subject: z.string().describe('The subject line of the inquiry.'),
  text: z.string().describe('The full text of the inquiry or request.'),
  availableItems: z.array(z.string()).describe('A list of inventory items available for request.'),
  currentRoom: z.string().describe("The student's current room number."),
});
export type ProcessInquiryInput = z.infer<typeof ProcessInquiryInputSchema>;

export const ProcessInquiryOutputSchema = z.object({
  category: z
    .enum(['Question', 'Item Request', 'Room Change Request'])
    .describe(
      'The category of the inquiry. Is it a general question, a request for an item, or a request to change rooms?'
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
  prompt: `You are an AI assistant for a hostel. Your job is to analyze student inquiries based on the type of inquiry they selected.

  Analyze the following inquiry and determine its urgency: 'High', 'Medium', or 'Low'.
  Provide a short summary of the inquiry.

  The user has pre-selected the type of inquiry: {{{inquiryType}}}. Set the 'category' field in your output to this value.

  Current student room: {{{currentRoom}}}

  {{#if (eq inquiryType "Item Request")}}
  If the student is requesting an item, you MUST identify which item they are asking for from the provided list of available items. If the requested item is not in the list, do not populate the requestedItem field.

  Available items for request:
  {{#each availableItems}}
  - {{{this}}}
  {{/each}}
  {{/if}}
  
  {{#if (eq inquiryType "Room Change Request")}}
  Analyze the reason for the room change request. The summary should capture why the student wants to move.
  {{/if}}

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
