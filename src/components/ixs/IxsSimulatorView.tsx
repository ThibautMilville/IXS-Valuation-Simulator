"use client";

import { useMemo, useState } from "react";
import type { IxsDashboardMetrics } from "@/lib/ixs-dashboard";
import { clamp } from "@/lib/clamp";
import { computeIxsSimulation } from "@/lib/ixs-simulator";
import {
  getBurnedSliderConfig,
  INPUT_MAX_IXS,
  INPUT_MAX_MC_TO_TVL_RATIO,
  INPUT_MAX_USD,
  SLIDER_HOLDER,
  SLIDER_MC_TO_TVL_RATIO,
  SLIDER_TVL,
} from "@/lib/slider-ranges";
import {
  formatInteger,
  formatNumber,
  formatPercent,
  formatUsd,
  formatUsdCompact,
  formatUsdPrice,
} from "@/lib/format-numbers";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { IxsLogo } from "@/components/ixs/IxsLogo";

const DEFAULT_HOLDER_QUANTITY = 10_000;
const DEFAULT_MC_TO_TVL_RATIO = 0.3;

type IxsSimulatorViewProps = {
  metrics: IxsDashboardMetrics;
  initialMarketCapUsd: number;
};

export function IxsSimulatorView({
  metrics,
  initialMarketCapUsd,
}: IxsSimulatorViewProps) {
  const [totalSupply] = useState(metrics.total_supply);

  const [tvlUsd, setTvlUsd] = useState(() =>
    clamp(metrics.tvl_usd, SLIDER_TVL.min, INPUT_MAX_USD),
  );
  const [mcToTvlRatio, setMcToTvlRatio] = useState(() => {
    const tvl = metrics.tvl_usd;
    if (tvl > 0 && Number.isFinite(initialMarketCapUsd)) {
      return clamp(
        initialMarketCapUsd / tvl,
        SLIDER_MC_TO_TVL_RATIO.min,
        INPUT_MAX_MC_TO_TVL_RATIO,
      );
    }
    return DEFAULT_MC_TO_TVL_RATIO;
  });
  const [burnedTokens, setBurnedTokens] = useState(() => {
    const bc = getBurnedSliderConfig(metrics.total_supply);
    return Math.round(
      clamp(metrics.total_tokens_burned, bc.min, INPUT_MAX_IXS),
    );
  });
  const [holderQuantity, setHolderQuantity] = useState(DEFAULT_HOLDER_QUANTITY);

  const scenarioMarketCapUsd = tvlUsd * mcToTvlRatio;

  const burnedSlider = useMemo(
    () => getBurnedSliderConfig(totalSupply),
    [totalSupply],
  );

  const holderBalanceLabel = useMemo(() => {
    const circulating = totalSupply - burnedTokens;
    if (circulating <= 0) {
      return "Holder balance (—)";
    }
    const pct = (holderQuantity / circulating) * 100;
    return `Holder balance (${formatPercent(pct, 2)})`;
  }, [totalSupply, burnedTokens, holderQuantity]);

  const parsed = useMemo(() => {
    const result = computeIxsSimulation({
      tvlUsd,
      mcToTvlRatio,
      burnedTokens,
      holderQuantity,
      totalSupply,
    });
    if (result === null) {
      return { ok: false as const, error: "supply" as const };
    }
    return { ok: true as const, result };
  }, [tvlUsd, mcToTvlRatio, burnedTokens, holderQuantity, totalSupply]);

  const errorMessage =
    parsed.ok === false && parsed.error === "supply"
      ? `Burned tokens must stay below total supply (${formatInteger(totalSupply)} IXS).`
      : null;

  return (
    <div className="flex min-h-dvh w-full flex-col px-4 py-6 pb-12 sm:px-6 sm:py-8 sm:pb-16">
      <div className="mx-auto flex w-full max-w-md flex-col md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <header className="flex w-full shrink-0 flex-col items-center pb-6 text-center sm:pb-8">
          <div className="mb-3 flex justify-center sm:mb-4">
            <div className="relative flex items-center justify-center">
              <div
                className="pointer-events-none absolute inset-[-35%] rounded-full bg-[#2564dd]/18 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-[-20%] rounded-full border border-[#2564dd]/15"
                aria-hidden
              />
              <IxsLogo className="relative h-10 w-auto text-white drop-shadow-[0_0_32px_rgb(37_100_221_/_0.4)] sm:h-11 md:h-12" />
            </div>
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-zinc-500">
            Valuation
          </p>
          <h1 className="mt-1.5 max-w-xl text-balance bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl md:text-[2rem]">
            IXS price simulator
          </h1>
          <p className="mt-3 max-w-lg text-pretty text-xs leading-relaxed text-zinc-500 sm:mt-4 sm:text-sm">
            Supply {formatInteger(totalSupply)} IXS. Scenario market cap is{" "}
            <span className="font-medium text-zinc-400">(MC ÷ TVL) × TVL</span>{" "}
            — e.g. ratio 0.3 and TVL $100M ⇒ MC $30M. Implied price = scenario
            MC ÷ circulation. Stack = balance × price.
          </p>
        </header>

        <div className="w-full">
          <section className="rounded-3xl border border-white/[0.1] bg-gradient-to-b from-zinc-900/75 via-zinc-950/92 to-[#09090b] p-5 shadow-2xl shadow-black/50 ring-1 ring-inset ring-white/[0.06] backdrop-blur-xl sm:p-6 md:p-8">
              <div className="mb-6 text-center md:mb-8">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl md:leading-[1.1]">
                  Simulator
                </h2>
                <div
                  className="mx-auto mt-4 h-px max-w-[12rem] bg-gradient-to-r from-transparent via-[#2564dd]/70 to-transparent"
                  aria-hidden
                />
                <p className="mx-auto mt-3 max-w-md text-[13px] leading-snug text-zinc-500">
                  Tune TVL, ratio, supply and balance — results update live.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 md:gap-x-8">
                <div className="flex flex-col gap-5 rounded-2xl md:bg-zinc-950/50 md:p-5 md:ring-1 md:ring-white/[0.06]">
                  <RangeSlider
                    id="tvl"
                    label="TVL"
                    min={SLIDER_TVL.min}
                    max={SLIDER_TVL.max}
                    step={SLIDER_TVL.step}
                    inputMin={0}
                    inputMax={INPUT_MAX_USD}
                    value={tvlUsd}
                    onChange={setTvlUsd}
                    formatValue={(v) => formatUsdCompact(v)}
                    hint="Total value locked."
                    manualSuffix="USD"
                  />
                  <RangeSlider
                    id="mc-tvl-ratio"
                    label="MC ÷ TVL (scenario)"
                    min={SLIDER_MC_TO_TVL_RATIO.min}
                    max={SLIDER_MC_TO_TVL_RATIO.max}
                    step={SLIDER_MC_TO_TVL_RATIO.step}
                    inputMin={0}
                    inputMax={INPUT_MAX_MC_TO_TVL_RATIO}
                    value={mcToTvlRatio}
                    onChange={setMcToTvlRatio}
                    formatValue={(r) => formatNumber(r)}
                    hint="Scenario market cap = this ratio × TVL."
                  />
                </div>

                <div className="flex flex-col gap-5 rounded-2xl md:bg-zinc-950/50 md:p-5 md:ring-1 md:ring-white/[0.06]">
                  <RangeSlider
                    id="burned"
                    label="Burned tokens"
                    min={burnedSlider.min}
                    max={burnedSlider.max}
                    step={burnedSlider.step}
                    inputMin={0}
                    inputMax={INPUT_MAX_IXS}
                    value={burnedTokens}
                    onChange={setBurnedTokens}
                    formatValue={(v) => `${formatInteger(v)} IXS`}
                    manualSuffix="IXS"
                    integerOnly
                  />
                  <RangeSlider
                    id="holder"
                    label={holderBalanceLabel}
                    min={SLIDER_HOLDER.min}
                    max={SLIDER_HOLDER.max}
                    step={SLIDER_HOLDER.step}
                    inputMin={0}
                    inputMax={INPUT_MAX_IXS}
                    value={holderQuantity}
                    onChange={setHolderQuantity}
                    formatValue={(v) => `${formatNumber(v)} IXS`}
                    hint="Share of circulating is shown in the label."
                    manualSuffix="IXS"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-center md:mt-8">
                <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#2564dd]/20 bg-gradient-to-b from-[#2564dd]/[0.12] via-zinc-950/90 to-zinc-950 px-5 py-4 text-center shadow-lg shadow-[#2564dd]/[0.08] sm:px-6 sm:py-5">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    aria-hidden
                  />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#93b4f0]">
                    Scenario market cap
                  </p>
                  <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-white sm:text-2xl">
                    {formatUsdCompact(scenarioMarketCapUsd)}
                  </p>
                  <p className="mt-2 text-balance font-mono text-[10px] leading-relaxed tabular-nums text-zinc-400 sm:text-xs">
                    = (MC ÷ TVL) × TVL = {formatNumber(mcToTvlRatio)} ×{" "}
                    {formatUsdCompact(tvlUsd)}
                  </p>
                </div>
              </div>

              {errorMessage ? (
                <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-950/35 px-4 py-3 text-center text-sm text-amber-100/95">
                  {errorMessage}
                </div>
              ) : null}

              {parsed.ok ? (
                <div className="mt-6 w-full rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5 sm:mt-8 sm:p-6">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                      Stack value
                    </span>
                    <span className="font-mono text-3xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl">
                      {formatUsd(parsed.result.holderValueUsd)}
                    </span>
                  </div>
                  <p className="mt-3 text-center text-sm text-zinc-400">
                    {formatNumber(parsed.result.holderQuantity)} IXS ×{" "}
                    <span className="font-mono text-zinc-200">
                      {formatUsdPrice(parsed.result.priceUsd)}
                    </span>{" "}
                    implied
                  </p>
                  <p className="mt-3 text-center text-[11px] leading-relaxed tabular-nums text-zinc-500 sm:text-xs">
                    TVL {formatUsdCompact(parsed.result.tvlUsd)} · scenario MC{" "}
                    {formatUsdCompact(parsed.result.marketCapUsd)} · TVL ÷ MC{" "}
                    {formatNumber(parsed.result.tvlToMcRatio)}
                  </p>
                </div>
              ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
