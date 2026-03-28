import { IxsSimulatorView } from "@/components/ixs/IxsSimulatorView";
import { fetchIxsUsdMarketCap } from "@/lib/coingecko-ixs";
import {
  FALLBACK_IXS_METRICS,
  fetchIxsDashboardMetrics,
} from "@/lib/ixs-dashboard";
import { searchParamsRecordToURLSearchParams } from "@/lib/search-params-record";
import { parseShareUrlQuery } from "@/lib/share-url-state";

const DEFAULT_MARKET_CAP_USD = 50_000_000;

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const [chainMetrics, coingeckoMc, rawSearch] = await Promise.all([
    fetchIxsDashboardMetrics(),
    fetchIxsUsdMarketCap(),
    searchParams,
  ]);

  const metrics = chainMetrics ?? FALLBACK_IXS_METRICS;
  const initialMarketCapUsd = coingeckoMc ?? DEFAULT_MARKET_CAP_USD;
  const shareRestore = parseShareUrlQuery(
    searchParamsRecordToURLSearchParams(rawSearch),
  );

  return (
    <IxsSimulatorView
      metrics={metrics}
      initialMarketCapUsd={initialMarketCapUsd}
      shareRestore={shareRestore}
    />
  );
}
