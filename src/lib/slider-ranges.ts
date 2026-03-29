export const SLIDER_TVL = {
  min: 0,
  max: 100_000_000_000,
  step: "any" as const,
} as const;

export const SLIDER_MC_TO_TVL_RATIO = {
  min: 0,
  max: 10,
  step: "any" as const,
} as const;

export function getBurnedSliderConfig(totalSupply: number) {
  const max = Math.max(totalSupply - 1, 0);
  return { min: 0, max, step: "any" as const } as const;
}

export const SLIDER_HOLDER = {
  min: 0,
  max: 1_000_000,
  step: "any" as const,
} as const;

export const INPUT_MAX_USD = Number.MAX_SAFE_INTEGER;

export const INPUT_MAX_IXS = 180_000_000;

export const INPUT_MAX_MC_TO_TVL_RATIO = 10;

export const SLIDER_LAUNCHPAD_FEE_PERCENT = {
  min: 0,
  max: 25,
  step: "any" as const,
} as const;

export const SLIDER_BTC_YIELD_FEE_PERCENT = {
  min: 0.5,
  max: 1,
  step: "any" as const,
} as const;
