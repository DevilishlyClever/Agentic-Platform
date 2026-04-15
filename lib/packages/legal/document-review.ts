import { generateText, Output } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const ReviewSchema = z.object({
  summary: z.string().describe('Plain-language summary of the document'),
  riskLevel: z.enum(['low', 'medium', 'high']).describe('Overall risk level'),
  risks: z.array(z.object({
    clause: z.string().describe('The clause or section with risk'),
    description: z.string().describe('What the risk is'),
    severity: z.enum(['low', 'medium', 'high']),
    recommendation: z.string().describe('Suggested action or amendment'),
  })),
  keyTerms: z.array(z.object({
    term: z.string(),
    value: z.string().describe('The specific value or condition'),
  })).describe('Key contractual terms extracted'),
  disclaimer: z.string(),
})

export type DocumentReviewOutput = z.infer<typeof ReviewSchema>

export async function reviewDocument(
  documentText: string,
  clientId: string,
  _config: Record<string, unknown> = {}
): Promise<{ output: DocumentReviewOutput; tokensUsed: number }> {
  const { output, usage } = await generateText({
    model: anthropic('claude-sonnet-4.6'),
    output: Output.object({ schema: ReviewSchema }),
    system: `You are an expert legal document reviewer. Analyze contracts and legal documents for risks, key terms, and issues. Be thorough but concise. Always include a disclaimer that this is AI-assisted analysis, not legal advice.`,
    prompt: `Review the following legal document and provide a structured risk analysis:\n\n${documentText}`,
    maxOutputTokens: 4096,
  })

  return {
    output: output as DocumentReviewOutput,
    tokensUsed: usage.totalTokens ?? 0,
  }
}
