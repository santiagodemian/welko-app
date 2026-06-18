/**
 * prisma/seed.ts
 *
 * Populates default TransferPipeline stages for a given agency.
 * Stages are per-agency — this seed requires SEED_AGENCY_ID in .env.
 *
 * Usage:
 *   SEED_AGENCY_ID=<cuid> npx ts-node prisma/seed.ts
 *
 * In production, stages are created automatically on agency creation
 * via the onboarding API route (POST /api/onboarding).
 */

import { PrismaClient, TransferStageName } from '@prisma/client'

const db = new PrismaClient()

const DEFAULT_STAGES: { name: TransferStageName; positionIndex: number }[] = [
  { name: 'INITIAL_CONTACT',  positionIndex: 0 },
  { name: 'PROPOSAL_SENT',    positionIndex: 1 },
  { name: 'FINANCIAL_TALKS',  positionIndex: 2 },
  { name: 'CONTRACT_CLOSURE', positionIndex: 3 },
]

async function main() {
  const agencyId = process.env.SEED_AGENCY_ID
  if (!agencyId) {
    throw new Error('SEED_AGENCY_ID env variable is required. Set it to the agency cuid to seed.')
  }

  console.log(`Seeding pipeline stages for agency: ${agencyId}`)

  for (const stage of DEFAULT_STAGES) {
    await db.transferPipeline.upsert({
      where:  { agencyId_name: { agencyId, name: stage.name } },
      update: { positionIndex: stage.positionIndex },
      create: { agencyId, name: stage.name, positionIndex: stage.positionIndex },
    })
    console.log(`  ✓ ${stage.name}`)
  }

  console.log('Done.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
