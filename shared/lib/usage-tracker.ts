import type { UsageStore, UsageSummary } from '@/shared/types/usage'

const globalRef = globalThis as unknown as { __usageStore?: UsageStore }

const store: UsageStore = (globalRef.__usageStore ??= {
  records: [],
  totalCostUsd: 0,
})

export function trackUsage(
  model: string,
  inputTokens: number,
  outputTokens: number,
  costUsd: number
) {
  store.records.push({
    timestamp: new Date(),
    model,
    inputTokens,
    outputTokens,
    costUsd,
  })
  store.totalCostUsd += costUsd
}

export function getUsageSummary(): UsageSummary {
  return {
    totalRecords: store.records.length,
    totalInputTokens: store.records.reduce((acc, r) => acc + r.inputTokens, 0),
    totalOutputTokens: store.records.reduce((acc, r) => acc + r.outputTokens, 0),
    totalCostUsd: store.totalCostUsd,
    recentRecords: store.records.slice(-10),
  }
}
