export interface ModelPricing {
  input: number
  output: number
}

export interface UsageRecord {
  timestamp: Date
  model: string
  inputTokens: number
  outputTokens: number
  costUsd: number
}

export interface UsageStore {
  records: UsageRecord[]
  totalCostUsd: number
}

export interface UsageSummary {
  totalRecords: number
  totalInputTokens: number
  totalOutputTokens: number
  totalCostUsd: number
  recentRecords: UsageRecord[]
}
