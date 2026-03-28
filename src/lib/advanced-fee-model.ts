export type FeeProductLine = {
  id: string;
  title: string;
  totalFeeUsd: number;
  buybackFromFeeUsd: number;
  burnFromFeeUsd: number;
};

const LP_SWAP_PROTOCOL_RATE = 0.01;
const LP_SWAP_BUYBACK_SHARE = 0.05;
const LP_SWAP_BURN_SHARE = 0.05;

const LP_LISTING_BUYBACK_SHARE = 0.05;
const LP_LISTING_BURN_SHARE = 0.05;

const LAUNCHPAD_BUYBACK_SHARE = 0.15;
const LAUNCHPAD_BURN_SHARE = 0.15;

const BTC_YIELD_BUYBACK_SHARE = 0.1;
const BTC_YIELD_BURN_SHARE = 0.1;

const SAAS_BUYBACK_SHARE = 0.1;
const SAAS_BURN_SHARE = 0.1;

export type AdvancedFeeInputs = {
  lpSwapVolumeUsd: number;
  lpListingFlatFeeUsd: number;
  launchpadRaisedUsd: number;
  launchpadFeePercentPoints: number;
  btcBorrowUsd: number;
  btcYieldFeePercentPoints: number;
  saasFlatUsd: number;
  saasMonthlyUsd: number;
};

function splitFee(
  totalFeeUsd: number,
  buybackShare: number,
  burnShare: number,
) {
  const safe = Math.max(0, totalFeeUsd);
  return {
    totalFeeUsd: safe,
    buybackFromFeeUsd: safe * buybackShare,
    burnFromFeeUsd: safe * burnShare,
  };
}

export function computeAdvancedFeeLines(
  input: AdvancedFeeInputs,
): FeeProductLine[] {
  const lpSwapTotal = Math.max(0, input.lpSwapVolumeUsd) * LP_SWAP_PROTOCOL_RATE;
  const lpSwap = splitFee(
    lpSwapTotal,
    LP_SWAP_BUYBACK_SHARE,
    LP_SWAP_BURN_SHARE,
  );

  const lpList = splitFee(
    Math.max(0, input.lpListingFlatFeeUsd),
    LP_LISTING_BUYBACK_SHARE,
    LP_LISTING_BURN_SHARE,
  );

  const launchpadRate = Math.max(0, input.launchpadFeePercentPoints) / 100;
  const launchpadTotal =
    Math.max(0, input.launchpadRaisedUsd) * launchpadRate;
  const launchpad = splitFee(
    launchpadTotal,
    LAUNCHPAD_BUYBACK_SHARE,
    LAUNCHPAD_BURN_SHARE,
  );

  const btcRate = Math.max(0, input.btcYieldFeePercentPoints) / 100;
  const btcTotal = Math.max(0, input.btcBorrowUsd) * btcRate;
  const btc = splitFee(btcTotal, BTC_YIELD_BUYBACK_SHARE, BTC_YIELD_BURN_SHARE);

  const saasTotal =
    Math.max(0, input.saasFlatUsd) + Math.max(0, input.saasMonthlyUsd);
  const saas = splitFee(saasTotal, SAAS_BUYBACK_SHARE, SAAS_BURN_SHARE);

  return [
    {
      id: "lp-swap",
      title: "Liquidity pool swap fees",
      ...lpSwap,
    },
    {
      id: "lp-listing",
      title: "Liquidity pool listing",
      ...lpList,
    },
    {
      id: "launchpad",
      title: "Launchpad listing",
      ...launchpad,
    },
    {
      id: "btc-yield",
      title: "BTC yield program",
      ...btc,
    },
    {
      id: "saas",
      title: "SaaS",
      ...saas,
    },
  ];
}

export function aggregateAdvancedFees(lines: FeeProductLine[]) {
  let totalFeeUsd = 0;
  let buybackFromFeeUsd = 0;
  let burnFromFeeUsd = 0;
  for (const line of lines) {
    totalFeeUsd += line.totalFeeUsd;
    buybackFromFeeUsd += line.buybackFromFeeUsd;
    burnFromFeeUsd += line.burnFromFeeUsd;
  }
  return { totalFeeUsd, buybackFromFeeUsd, burnFromFeeUsd };
}
