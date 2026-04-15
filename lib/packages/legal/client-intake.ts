import { generateText, Output, gateway } from 'ai'
import { z } from 'zod'

const IntakeSchema = z.object({
  matterType: z.string().describe('Classification of the legal matter (e.g., contract dispute, employment, IP)'),
  urgency: z.enum(['routine', 'urgent', 'emergency']),
  parties: z.array(z.object({
    role: z.string(),
    name: z.string(),
    contactInfo: z.string().optional(),
  })),
  keyFacts: z.array(z.string()).describe('Most important facts extracted from the intake form'),
  relevantDates: z.array(z.object({
    event: z.string(),
    date: z.string(),
  })),
  requestedOutcome: z.string().describe('What the client is seeking'),
  recommendedNextSteps: z.array(z.string()),
  conflictCheckItems: z.array(z.string()).describe('Names and entities that should be run through conflict-of-interest checks'),
})

export type ClientIntakeOutput = z.infer<typeof IntakeSchema>

export async function processClientIntake(
  formData: Record<string, unknown>,
  clientId: string,
  _config: Record<string, unknown> = {}
): Promise<{ output: ClientIntakeOutput; tokensUsed: number }> {
  const { output, usage } = await generateText({
    model: gateway('anthropic/claude-sonnet-4.6'),
    output: Output.object({ schema: IntakeSchema }),
    system: `You are a legal intake specialist. Extract and structure information from client intake forms to prepare case files for attorneys. Be precise with names, dates, and facts. Always flag items for conflict-of-interest checks.`,
    prompt: `Process this client intake form and extract structured case information:\n\n${JSON.stringify(formData, null, 2)}`,
    maxOutputTokens: 3000,
    providerOptions: {
      gateway: {
        user: clientId,
        tags: ['vertical:legal', 'package:client_intake'],
      },
    },
  })

  return {
    output: output as ClientIntakeOutput,
    tokensUsed: usage.totalTokens ?? 0,
  }
}
