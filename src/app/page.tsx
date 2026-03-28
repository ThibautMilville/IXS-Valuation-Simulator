import { IxsSimulatorView } from "@/components/ixs/IxsSimulatorView";
import { fetchIxsUsdMarketCap } from "@/lib/coingecko-ixs";
import {
  FALLBACK_IXS_METRICS,
  fetchIxsDashboardMetrics,
} from "@/lib/ixs-dashboard";

const DEFAULT_MARKET_CAP_USD = 50_000_000;

export default async function Home() {
  const [chainMetrics, coingeckoMc] = await Promise.all([
    fetchIxsDashboardMetrics(),
    fetchIxsUsdMarketCap(),
  ]);

  const metrics = chainMetrics ?? FALLBACK_IXS_METRICS;
  const initialMarketCapUsd = coingeckoMc ?? DEFAULT_MARKET_CAP_USD;

  return (
    <IxsSimulatorView
      metrics={metrics}
      initialMarketCapUsd={initialMarketCapUsd}
    />
  );
}
