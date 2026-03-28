export type IxsDashboardMetrics = {
  tvl_usd: number;
  total_tokens_burned: number;
  total_supply: number;
  circulating_supply: number;
};

const METRICS_URL = "https://ixs-dashboard.vercel.app/metrics";

export const FALLBACK_IXS_METRICS: IxsDashboardMetrics = {
  tvl_usd: 88_564_699.95,
  total_tokens_burned: 972_268,
  total_supply: 180_000_000,
  circulating_supply: 179_027_732,
};

function isFinitePositive(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

export function parseIxsDashboardMetrics(
  data: unknown,
): IxsDashboardMetrics | null {
  if (data === null || typeof data !== "object") {
    return null;
  }
  const o = data as Record<string, unknown>;
  if (
    !isFinitePositive(o.tvl_usd) ||
    !isFinitePositive(o.total_tokens_burned) ||
    !isFinitePositive(o.total_supply) ||
    !isFinitePositive(o.circulating_supply)
  ) {
    return null;
  }
  return {
    tvl_usd: o.tvl_usd,
    total_tokens_burned: o.total_tokens_burned,
    total_supply: o.total_supply,
    circulating_supply: o.circulating_supply,
  };
}

export async function fetchIxsDashboardMetrics(): Promise<IxsDashboardMetrics | null> {
  try {
    const res = await fetch(METRICS_URL, {
      next: { revalidate: 120 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return null;
    }
    const data: unknown = await res.json();
    return parseIxsDashboardMetrics(data);
  } catch {
    return null;
  }
}
