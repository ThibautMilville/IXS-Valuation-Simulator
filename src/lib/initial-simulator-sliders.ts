import type { IxsDashboardMetrics } from "@/lib/ixs-dashboard";
import { clamp } from "@/lib/clamp";
import {
  getBurnedSliderConfig,
  INPUT_MAX_IXS,
  INPUT_MAX_MC_TO_TVL_RATIO,
  INPUT_MAX_USD,
  SLIDER_HOLDER,
  SLIDER_MC_TO_TVL_RATIO,
  SLIDER_TVL,
} from "@/lib/slider-ranges";
import type { ShareUrlState } from "@/lib/share-url-state";

const DEFAULT_HOLDER_QUANTITY = 10_000;
const DEFAULT_MC_TO_TVL_RATIO = 0.3;

export type InitialSimulatorSliders = {
  tvlUsd: number;
  mcToTvlRatio: number;
  burnedTokens: number;
  holderQuantity: number;
};

export function buildInitialSimulatorSliders(
  metrics: IxsDashboardMetrics,
  initialMarketCapUsd: number,
  shareRestore: ShareUrlState | null,
): InitialSimulatorSliders {
  const totalSupply = metrics.total_supply;
  if (
    shareRestore &&
    Math.round(shareRestore.totalSupply) === Math.round(totalSupply)
  ) {
    const bc = getBurnedSliderConfig(totalSupply);
    return {
      tvlUsd: clamp(shareRestore.tvlUsd, SLIDER_TVL.min, INPUT_MAX_USD),
      mcToTvlRatio: clamp(
        shareRestore.mcToTvlRatio,
        SLIDER_MC_TO_TVL_RATIO.min,
        INPUT_MAX_MC_TO_TVL_RATIO,
      ),
      burnedTokens: Math.round(
        clamp(shareRestore.burnedTokens, bc.min, INPUT_MAX_IXS),
      ),
      holderQuantity: Math.round(
        clamp(
          shareRestore.holderQuantity,
          SLIDER_HOLDER.min,
          SLIDER_HOLDER.max,
        ),
      ),
    };
  }
  const burnedSlider = getBurnedSliderConfig(totalSupply);
  const tvl = metrics.tvl_usd;
  let mcToTvlRatio = DEFAULT_MC_TO_TVL_RATIO;
  if (tvl > 0 && Number.isFinite(initialMarketCapUsd)) {
    mcToTvlRatio = clamp(
      initialMarketCapUsd / tvl,
      SLIDER_MC_TO_TVL_RATIO.min,
      INPUT_MAX_MC_TO_TVL_RATIO,
    );
  }
  return {
    tvlUsd: clamp(metrics.tvl_usd, SLIDER_TVL.min, INPUT_MAX_USD),
    mcToTvlRatio,
    burnedTokens: Math.round(
      clamp(metrics.total_tokens_burned, burnedSlider.min, INPUT_MAX_IXS),
    ),
    holderQuantity: DEFAULT_HOLDER_QUANTITY,
  };
}
