import { generateListing } from './listing-gen'
import { qualifyLead } from './lead-qualify'
import { compareOffers } from './offer-compare'

export interface PackageResult {
  output: Record<string, unknown>
  tokensUsed: number
}

export async function runRealEstatePackage(
  pkg: string,
  input: Record<string, unknown>,
  config: Record<string, unknown>
): Promise<PackageResult> {
  const clientId = (input.clientId as string) ?? 'unknown'

  switch (pkg) {
    case 'listing_gen': {
      const propertyData = (input.propertyData as Record<string, unknown>) ?? input
      return generateListing(propertyData, clientId, config)
    }
    case 'lead_qualify': {
      const conversation = input.conversation as Array<{ role: 'agent' | 'lead'; message: string }>
      if (!conversation?.length) throw new Error('lead_qualify requires input.conversation array')
      return qualifyLead(conversation, clientId, config)
    }
    case 'offer_compare': {
      const offers = input.offers as Array<Record<string, unknown>>
      const propertyDetails = (input.propertyDetails as Record<string, unknown>) ?? {}
      if (!offers?.length) throw new Error('offer_compare requires input.offers array')
      return compareOffers(offers, propertyDetails, clientId, config)
    }
    default:
      throw new Error(`Unknown real estate package: ${pkg}`)
  }
}
