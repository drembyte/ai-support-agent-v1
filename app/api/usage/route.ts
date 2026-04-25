import { getUsageSummary } from '@/shared/lib/usage-tracker'

export async function GET() {
  const summary = getUsageSummary()
  return Response.json(summary)
}