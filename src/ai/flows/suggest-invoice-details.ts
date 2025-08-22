'use server';

/**
 * @fileOverview AI-powered invoice detail suggestion flow.
 *
 * - suggestInvoiceDetails - A function that suggests invoice details based on a description.
 * - SuggestInvoiceDetailsInput - The input type for the suggestInvoiceDetails function.
 * - SuggestInvoiceDetailsOutput - The return type for the suggestInvoiceDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInvoiceDetailsInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('A description of the transaction for which an invoice is being generated.'),
  businessProfile: z
    .string()
    .optional()
    .describe('A business profile with details of the company.'),
});
export type SuggestInvoiceDetailsInput = z.infer<typeof SuggestInvoiceDetailsInputSchema>;

const SuggestInvoiceDetailsOutputSchema = z.object({
  invoiceNumber: z.string().describe('The invoice number.'),
  issueDate: z.string().describe('The issue date of the invoice (YYYY-MM-DD).'),
  dueDate: z.string().describe('The due date of the invoice (YYYY-MM-DD).'),
  billingAddress: z.string().describe('The billing address.'),
  shippingAddress: z.string().describe('The shipping address, if different from the billing address.'),
  items: z
    .array(
      z.object({
        description: z.string().describe('A description of the item.'),
        quantity: z.number().describe('The quantity of the item.'),
        unitPrice: z.number().describe('The unit price of the item.'),
      })
    )
    .describe('A list of items in the invoice.'),
  totalAmount: z.number().describe('The total amount of the invoice.'),
});
export type SuggestInvoiceDetailsOutput = z.infer<typeof SuggestInvoiceDetailsOutputSchema>;

export async function suggestInvoiceDetails(input: SuggestInvoiceDetailsInput): Promise<SuggestInvoiceDetailsOutput> {
  return suggestInvoiceDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInvoiceDetailsPrompt',
  input: {schema: SuggestInvoiceDetailsInputSchema},
  output: {schema: SuggestInvoiceDetailsOutputSchema},
  prompt: `You are an AI invoice assistant that pre-populates invoice details based on the provided transaction description.

  Here is the transaction description: {{{transactionDescription}}}.
  Here is the business profile: {{{businessProfile}}}.

  Please extract the following information and format it according to the SuggestInvoiceDetailsOutputSchema.
  Include at least one item in the items array. Be as accurate as possible and make reasonable estimations for any missing information.
  Make sure the dates are YYYY-MM-DD.
  Calculate the total amount based on the items provided.`,
});

const suggestInvoiceDetailsFlow = ai.defineFlow(
  {
    name: 'suggestInvoiceDetailsFlow',
    inputSchema: SuggestInvoiceDetailsInputSchema,
    outputSchema: SuggestInvoiceDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
