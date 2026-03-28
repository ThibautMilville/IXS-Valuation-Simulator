import { IXS_MAX_SUPPLY } from "@/lib/ixs-simulator";

export const SLIDER_MARKET_CAP = {
  min: 2_000_000,
  max: 500_000_000,
  step: 1_000_000,
} as const;

export const SLIDER_TVL = {
  min: 0,
  max: 200_000_000,
  step: 500_000,
} as const;

export const SLIDER_BURNED = {
  min: 0,
  max: Math.max(IXS_MAX_SUPPLY - 1, 0),
  step: 1_000,
} as const;

export const SLIDER_HOLDER = {
  min: 0,
  max: 25_000_000,
  step: 5_000,
} as const;
