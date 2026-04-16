import { generateText, Output } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const DraftSchema = z.object({
  sections: z.array(z.object({
    title: z.string(),
    content: z.string(),
    notes: z.string().optional().describe('Drafting notes or placeholders requiring human review'),
  })),
  reviewPoints: z.array(z.string()).describe('Items requiring attorney review before execution'),
  disclaimer: z.string(),
})

export type ContractDraftOutput = z.infer<typeof DraftSchema>

export async function draftContract(
  templateType: string,
  parameters: Record<string, unknown>,
  clientId: string,
  _config: Record<string, unknown> = {}
): Promise<{ output: ContractDraftOutput; tokensUsed: number }> {
  const { output, usage } = await generateText({
    model: anthropic('claude-sonnet-4-6'),
    output: Output.object({ schema: DraftSchema }),
    system: `You are an expert legal drafting assistant. Draft contract sections based on templates and parameters. Flag all items requiring attorney review. Never present AI-generated content as final legal documents.`,
    prompt: `Draft a ${templateType} contract with the following parameters:\n${JSON.stringify(parameters, null, 2)}`,
    maxOutputTokens: 6000,
  })

  return {
    output: output as ContractDraftOutput,
    tokensUsed: usage.totalTokens ?? 0,
  }
}
