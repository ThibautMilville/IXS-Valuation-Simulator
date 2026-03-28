export const IXS_MAX_SUPPLY = 180_000_000;

export type IxsSimulatorInput = {
  marketCapUsd: number;
  tvlUsd: number;
  burnedTokens: number;
  holderQuantity: number;
};

export type IxsSimulatorResult = {
  circulatingSupply: number;
  priceUsd: number;
  holderQuantity: number;
  holderValueUsd: number;
  burnPercentOfMax: number;
  tvlToMcRatio: number;
  fdvUsd: number;
};

function isValidNonNegative(n: number): boolean {
  return Number.isFinite(n) && n >= 0;
}

export function computeIxsSimulation(
  input: IxsSimulatorInput,
): IxsSimulatorResult | null {
  if (
    !isValidNonNegative(input.marketCapUsd) ||
    !isValidNonNegative(input.tvlUsd) ||
    !isValidNonNegative(input.burnedTokens) ||
    !isValidNonNegative(input.holderQuantity)
  ) {
    return null;
  }

  const circulatingSupply = IXS_MAX_SUPPLY - input.burnedTokens;
  if (circulatingSupply <= 0) {
    return null;
  }

  const priceUsd = input.marketCapUsd / circulatingSupply;
  const holderValueUsd = input.holderQuantity * priceUsd;
  const burnPercentOfMax = (input.burnedTokens / IXS_MAX_SUPPLY) * 100;
  const tvlToMcRatio =
    input.marketCapUsd > 0 ? input.tvlUsd / input.marketCapUsd : 0;
  const fdvUsd = priceUsd * IXS_MAX_SUPPLY;

  return {
    circulatingSupply,
    priceUsd,
    holderQuantity: input.holderQuantity,
    holderValueUsd,
    burnPercentOfMax,
    tvlToMcRatio,
    fdvUsd,
  };
}
