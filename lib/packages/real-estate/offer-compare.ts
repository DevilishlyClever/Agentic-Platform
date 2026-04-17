import { generateText, Output } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const OfferSchema = z.object({
  summary: z.string().describe('Executive summary of the offer comparison'),
  offers: z.array(z.object({
    offerId: z.string(),
    purchasePrice: z.string(),
    downPayment: z.string(),
    financingType: z.string(),
    contingencies: z.array(z.string()),
    closingTimeline: z.string(),
    earnestMoney: z.string(),
    score: z.number().describe('Overall offer strength score 0-100'),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
  })),
  recommendation: z.object({
    topOffer: z.string().describe('offerId of the recommended offer'),
    rationale: z.string(),
    counterStrategy: z.string().optional().describe('Suggested counter-offer strategy if applicable'),
  }),
})

export type OfferCompareOutput = z.infer<typeof OfferSchema>

export async function compareOffers(
  offers: Array<Record<string, unknown>>,
  propertyDetails: Record<string, unknown>,
  clientId: string,
  _config: Record<string, unknown> = {}
): Promise<{ output: OfferCompareOutput; tokensUsed: number }> {
  const { output, usage } = await generateText({
    model: anthropic('claude-sonnet-4-6'),
    output: Output.object({ schema: OfferSchema }),
    system: `You are an expert real estate transaction analyst. Compare purchase offers objectively, weighing price, financing strength, contingencies, and timeline. Help sellers make informed decisions.`,
    prompt: `Compare these ${offers.length} offers on the property:\n\nProperty: ${JSON.stringify(propertyDetails, null, 2)}\n\nOffers:\n${JSON.stringify(offers, null, 2)}`,
    maxOutputTokens: 3000,
  })

  return {
    output: output as OfferCompareOutput,
    tokensUsed: usage.totalTokens ?? 0,
  }
}
