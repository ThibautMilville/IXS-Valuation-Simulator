import type { IxsSimulatorResult } from "@/lib/ixs-simulator";
import { computeIxsSimulation } from "@/lib/ixs-simulator";

export type ShareUrlState = {
  tvlUsd: number;
  mcToTvlRatio: number;
  burnedTokens: number;
  holderQuantity: number;
  totalSupply: number;
};

function num(sp: URLSearchParams, key: string): number | null {
  const raw = sp.get(key);
  if (raw === null || raw === "") {
    return null;
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    return null;
  }
  return n;
}

export function parseShareUrlQuery(sp: URLSearchParams): ShareUrlState | null {
  const tvlUsd = num(sp, "tvl");
  const mcToTvlRatio = num(sp, "mc");
  const burnedTokens = num(sp, "burn");
  const holderQuantity = num(sp, "holder");
  const totalSupply = num(sp, "supply");
  if (
    tvlUsd === null ||
    mcToTvlRatio === null ||
    burnedTokens === null ||
    holderQuantity === null ||
    totalSupply === null ||
    totalSupply <= 0
  ) {
    return null;
  }
  if (
    tvlUsd < 0 ||
    mcToTvlRatio < 0 ||
    burnedTokens < 0 ||
    holderQuantity < 0
  ) {
    return null;
  }
  return {
    tvlUsd,
    mcToTvlRatio,
    burnedTokens: Math.round(burnedTokens),
    holderQuantity: Math.round(holderQuantity),
    totalSupply: Math.round(totalSupply),
  };
}

export function simulationFromShareState(
  state: ShareUrlState,
): IxsSimulatorResult | null {
  return computeIxsSimulation({
    tvlUsd: state.tvlUsd,
    mcToTvlRatio: state.mcToTvlRatio,
    burnedTokens: state.burnedTokens,
    holderQuantity: state.holderQuantity,
    totalSupply: state.totalSupply,
  });
}
