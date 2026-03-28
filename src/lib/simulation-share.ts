import type { IxsSimulatorResult } from "@/lib/ixs-simulator";
import {
  formatInteger,
  formatNumber,
  formatPercent,
  formatUsd,
  formatUsdCompact,
  formatUsdPrice,
} from "@/lib/format-numbers";
export type SimulationShareBuildInput = {
  result: IxsSimulatorResult;
  totalSupply: number;
  pageUrl: string;
};

export function buildSimulationShareTitle(): string {
  return "IXS — Valuation simulator";
}

export function buildSimulationSharePlainText(
  input: SimulationShareBuildInput,
): string {
  const { result, totalSupply, pageUrl } = input;
  const lines = [
    buildSimulationShareTitle(),
    "",
    `TVL: ${formatUsdCompact(result.tvlUsd)}`,
    `MC/TVL (scenario): ${formatNumber(result.mcToTvlRatio)}`,
    `Scenario market cap: ${formatUsdCompact(result.marketCapUsd)}`,
    `Implied IXS price: ${formatUsdPrice(result.priceUsd)}`,
    "",
    `Holder balance: ${formatInteger(result.holderQuantity)} IXS`,
    `Stack value: ${formatUsd(result.holderValueUsd)}`,
    "",
    `Circulating supply: ${formatInteger(result.circulatingSupply)} IXS`,
    `Burned: ${formatInteger(
      totalSupply - result.circulatingSupply,
    )} IXS (${formatPercent(result.burnPercentOfMax, 2)} of max supply)`,
    `FDV (scenario): ${formatUsdCompact(result.fdvUsd)}`,
    "",
    pageUrl ? pageUrl : "",
  ];
  return lines.filter((l) => l !== "").join("\n");
}

export function buildSimulationTwitterShareText(
  input: SimulationShareBuildInput,
  maxLen = 240,
): string {
  const { result } = input;
  const body = `${buildSimulationShareTitle()}\nStack ${formatUsd(
    result.holderValueUsd,
  )} · IXS ${formatUsdPrice(result.priceUsd)} · MC ${formatUsdCompact(
    result.marketCapUsd,
  )}`;
  if (body.length > maxLen) {
    return `${body.slice(0, Math.max(0, maxLen - 1))}…`;
  }
  return body;
}

export function buildTwitterIntentUrl(text: string, url: string): string {
  const params = new URLSearchParams();
  params.set("text", text);
  if (url) {
    params.set("url", url);
  }
  return `https://x.com/intent/tweet?${params.toString()}`;
}
