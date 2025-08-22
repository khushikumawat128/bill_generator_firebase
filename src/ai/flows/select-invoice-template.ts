'use server';

/**
 * @fileOverview A flow to suggest invoice templates based on the type of business or transaction.
 *
 * - selectInvoiceTemplate - A function that handles the invoice template selection process.
 * - SelectInvoiceTemplateInput - The input type for the selectInvoiceTemplate function.
 * - SelectInvoiceTemplateOutput - The return type for the selectInvoiceTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SelectInvoiceTemplateInputSchema = z.object({
  businessType: z
    .string()
    .describe('The type of business or transaction for which the invoice is being generated.'),
  invoiceDetails: z.string().describe('Details about the invoice, such as the products or services provided, amounts, and any other relevant information.'),
});
export type SelectInvoiceTemplateInput = z.infer<typeof SelectInvoiceTemplateInputSchema>;

const SelectInvoiceTemplateOutputSchema = z.object({
  templateSuggestion: z.string().describe('A suggestion for an invoice template that is suitable for the given business type and invoice details.'),
  reasoning: z.string().describe('The reasoning behind the template suggestion.'),
});
export type SelectInvoiceTemplateOutput = z.infer<typeof SelectInvoiceTemplateOutputSchema>;

export async function selectInvoiceTemplate(input: SelectInvoiceTemplateInput): Promise<SelectInvoiceTemplateOutput> {
  return selectInvoiceTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'selectInvoiceTemplatePrompt',
  input: {schema: SelectInvoiceTemplateInputSchema},
  output: {schema: SelectInvoiceTemplateOutputSchema},
  prompt: `You are an expert in invoice design and template selection.

  Based on the type of business and the details of the invoice, suggest a suitable invoice template.
  Explain your reasoning for the template suggestion.

  Business Type: {{{businessType}}}
  Invoice Details: {{{invoiceDetails}}}
  `,
});

const selectInvoiceTemplateFlow = ai.defineFlow(
  {
    name: 'selectInvoiceTemplateFlow',
    inputSchema: SelectInvoiceTemplateInputSchema,
    outputSchema: SelectInvoiceTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
