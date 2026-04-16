import { generateText, Output } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const ListingSchema = z.object({
  headline: z.string().describe('Compelling MLS headline (max 80 chars)'),
  description: z.string().describe('Full MLS-ready listing description (150-300 words)'),
  highlights: z.array(z.string()).describe('Top 5 property highlights as bullet points'),
  seoKeywords: z.array(z.string()).describe('SEO keywords for online listings'),
  socialCaption: z.string().describe('Short caption for social media (max 240 chars)'),
})

export type ListingGenOutput = z.infer<typeof ListingSchema>

export async function generateListing(
  propertyData: Record<string, unknown>,
  clientId: string,
  _config: Record<string, unknown> = {}
): Promise<{ output: ListingGenOutput; tokensUsed: number }> {
  const { output, usage } = await generateText({
    model: anthropic('claude-sonnet-4-6'),
    output: Output.object({ schema: ListingSchema }),
    system: `You are an expert real estate copywriter. Create compelling, accurate, and MLS-compliant property descriptions. Focus on lifestyle appeal while being factually accurate. Avoid fair housing violations.`,
    prompt: `Generate a complete listing package for this property:\n\n${JSON.stringify(propertyData, null, 2)}`,
    maxOutputTokens: 2000,
  })

  return {
    output: output as ListingGenOutput,
    tokensUsed: usage.totalTokens ?? 0,
  }
}
