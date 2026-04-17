import { generateText, Output } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const LeadSchema = z.object({
  score: z.number().describe('Lead quality score 0-100'),
  tier: z.enum(['hot', 'warm', 'cold']).describe('Lead tier classification'),
  buyerProfile: z.object({
    priceRange: z.string(),
    timeline: z.string(),
    motivation: z.string(),
    financing: z.string().describe('Pre-approved, cash, needs financing, unknown'),
  }),
  strengths: z.array(z.string()).describe('Positive signals'),
  concerns: z.array(z.string()).describe('Red flags or friction points'),
  recommendedNextAction: z.string().describe('Specific next action for the agent'),
  suggestedProperties: z.array(z.string()).describe('Property types or criteria that match this lead'),
})

export type LeadQualifyOutput = z.infer<typeof LeadSchema>

export async function qualifyLead(
  conversation: Array<{ role: 'agent' | 'lead'; message: string }>,
  clientId: string,
  _config: Record<string, unknown> = {}
): Promise<{ output: LeadQualifyOutput; tokensUsed: number }> {
  const transcript = conversation
    .map(m => `${m.role.toUpperCase()}: ${m.message}`)
    .join('\n')

  const { output, usage } = await generateText({
    model: anthropic('claude-sonnet-4-6'),
    output: Output.object({ schema: LeadSchema }),
    system: `You are an expert real estate lead qualification specialist. Analyze lead conversations to score quality and readiness. Look for signals: timeline urgency, financing readiness, motivation, and decision authority.`,
    prompt: `Qualify this real estate lead based on the conversation:\n\n${transcript}`,
    maxOutputTokens: 2000,
  })

  return {
    output: output as LeadQualifyOutput,
    tokensUsed: usage.totalTokens ?? 0,
  }
}
