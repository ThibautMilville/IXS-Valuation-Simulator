export type IxsSimulatorInput = {
  tvlUsd: number;
  mcToTvlRatio: number;
  burnedTokens: number;
  holderQuantity: number;
  totalSupply: number;
};

export type IxsSimulatorResult = {
  circulatingSupply: number;
  tvlUsd: number;
  mcToTvlRatio: number;
  marketCapUsd: number;
  tvlToMcRatio: number;
  priceUsd: number;
  holderQuantity: number;
  holderValueUsd: number;
  burnPercentOfMax: number;
  fdvUsd: number;
};

function isValidNonNegative(n: number): boolean {
  return Number.isFinite(n) && n >= 0;
}

export function computeIxsSimulation(
  input: IxsSimulatorInput,
): IxsSimulatorResult | null {
  if (
    !isValidNonNegative(input.tvlUsd) ||
    !isValidNonNegative(input.mcToTvlRatio) ||
    !isValidNonNegative(input.burnedTokens) ||
    !isValidNonNegative(input.holderQuantity) ||
    !isValidNonNegative(input.totalSupply) ||
    input.totalSupply <= 0
  ) {
    return null;
  }

  const circulatingSupply = input.totalSupply - input.burnedTokens;
  if (circulatingSupply <= 0) {
    return null;
  }

  const marketCapUsd = input.tvlUsd * input.mcToTvlRatio;
  const tvlToMcRatio =
    marketCapUsd > 0 ? input.tvlUsd / marketCapUsd : 0;
  const priceUsd = marketCapUsd / circulatingSupply;
  const holderValueUsd = input.holderQuantity * priceUsd;
  const burnPercentOfMax = (input.burnedTokens / input.totalSupply) * 100;
  const fdvUsd = priceUsd * input.totalSupply;

  return {
    circulatingSupply,
    tvlUsd: input.tvlUsd,
    mcToTvlRatio: input.mcToTvlRatio,
    marketCapUsd,
    tvlToMcRatio,
    priceUsd,
    holderQuantity: input.holderQuantity,
    holderValueUsd,
    burnPercentOfMax,
    fdvUsd,
  };
}
