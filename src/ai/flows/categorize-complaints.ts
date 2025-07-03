'use server';

/**
 * @fileOverview A complaint categorization AI agent.
 *
 * - categorizeComplaint - A function that categorizes complaints.
 * - CategorizeComplaintInput - The input type for the categorizeComplaint function.
 * - CategorizeComplaintOutput - The return type for the categorizeComplaint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeComplaintInputSchema = z.object({
  complaintText: z.string().describe('The text of the complaint.'),
});

export type CategorizeComplaintInput = z.infer<typeof CategorizeComplaintInputSchema>;

const CategorizeComplaintOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The category of the complaint. Possible values: [Maintenance, Noise, Safety, Harassment, Other].'
    ),
  urgency: z
    .string()
    .describe(
      'The urgency of the complaint. Possible values: [High, Medium, Low].'
    ),
  summary: z.string().describe('A short summary of the complaint.'),
});

export type CategorizeComplaintOutput = z.infer<typeof CategorizeComplaintOutputSchema>;

export async function categorizeComplaint(
  input: CategorizeComplaintInput
): Promise<CategorizeComplaintOutput> {
  return categorizeComplaintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeComplaintPrompt',
  input: {schema: CategorizeComplaintInputSchema},
  output: {schema: CategorizeComplaintOutputSchema},
  prompt: `You are an AI assistant specializing in categorizing hostel complaints.
  Given the following complaint text, categorize it into one of the following categories: Maintenance, Noise, Safety, Harassment, Other.
  Also, determine the urgency of the complaint as High, Medium, or Low.
  Finally, provide a short summary of the complaint.

  Complaint Text: {{{complaintText}}}
  `,
});

const categorizeComplaintFlow = ai.defineFlow(
  {
    name: 'categorizeComplaintFlow',
    inputSchema: CategorizeComplaintInputSchema,
    outputSchema: CategorizeComplaintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
