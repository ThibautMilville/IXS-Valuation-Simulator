const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=ix-swap&vs_currencies=usd&include_market_cap=true";

type CoinGeckoPriceResponse = Record<
  string,
  { usd?: number; usd_market_cap?: number } | undefined
>;

export async function fetchIxsUsdMarketCap(): Promise<number | null> {
  try {
    const res = await fetch(COINGECKO_URL, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as CoinGeckoPriceResponse;
    const mc = data?.["ix-swap"]?.usd_market_cap;
    if (typeof mc !== "number" || !Number.isFinite(mc) || mc < 0) {
      return null;
    }
    return mc;
  } catch {
    return null;
  }
}
