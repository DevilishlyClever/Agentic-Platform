import { reviewDocument } from './document-review'
import { draftContract } from './contract-draft'
import { processClientIntake } from './client-intake'

export interface PackageResult {
  output: Record<string, unknown>
  tokensUsed: number
}

export async function runLegalPackage(
  pkg: string,
  input: Record<string, unknown>,
  config: Record<string, unknown>
): Promise<PackageResult> {
  const clientId = (input.clientId as string) ?? 'unknown'

  switch (pkg) {
    case 'document_review': {
      const documentText = input.documentText as string
      if (!documentText) throw new Error('document_review requires input.documentText')
      return reviewDocument(documentText, clientId, config)
    }
    case 'contract_draft': {
      const templateType = input.templateType as string
      const parameters = (input.parameters as Record<string, unknown>) ?? {}
      if (!templateType) throw new Error('contract_draft requires input.templateType')
      return draftContract(templateType, parameters, clientId, config)
    }
    case 'client_intake': {
      const formData = (input.formData as Record<string, unknown>) ?? input
      return processClientIntake(formData, clientId, config)
    }
    default:
      throw new Error(`Unknown legal package: ${pkg}`)
  }
}
