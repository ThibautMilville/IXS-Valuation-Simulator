"use client";

import { useMemo, useState } from "react";
import type { IxsDashboardMetrics } from "@/lib/ixs-dashboard";
import { computeIxsSimulation } from "@/lib/ixs-simulator";
import {
  getBurnedSliderConfig,
  INPUT_MAX_IXS,
  INPUT_MAX_MC_TO_TVL_RATIO,
  SLIDER_HOLDER,
  SLIDER_MC_TO_TVL_RATIO,
  SLIDER_TVL,
} from "@/lib/slider-ranges";
import {
  MANUAL_NUDGE_IXS_BURN,
  MANUAL_NUDGE_IXS_HOLDER,
  MANUAL_NUDGE_MC_TO_TVL,
  MANUAL_NUDGE_USD_SCENARIO,
} from "@/lib/simulator-constants";
import {
  formatInteger,
  formatNumber,
  formatPercent,
  formatUsd,
  formatUsdCompact,
  formatUsdPrice,
} from "@/lib/format-numbers";
import { AdvancedFeePanel } from "@/components/ixs/AdvancedFeePanel";
import { IxsLogo } from "@/components/ixs/IxsLogo";
import {
  SimulatorModeTabs,
  type SimulatorMode,
} from "@/components/ixs/SimulatorModeTabs";
import {
  IconBurned,
  IconHolderBalance,
  IconMcTvlRatio,
  IconTvl,
} from "@/components/icons/SimulatorUiIcons";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { SimulationShareControl } from "@/components/ixs/SimulationShareControl";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { buildInitialSimulatorSliders } from "@/lib/initial-simulator-sliders";

type IxsSimulatorViewProps = {
  metrics: IxsDashboardMetrics;
  initialMarketCapUsd: number;
};

export function IxsSimulatorView({
  metrics,
  initialMarketCapUsd,
}: IxsSimulatorViewProps) {
  const [totalSupply] = useState(metrics.total_supply);

  const [initialSliders] = useState(() =>
    buildInitialSimulatorSliders(metrics, initialMarketCapUsd),
  );
  const [tvlUsd, setTvlUsd] = useState(initialSliders.tvlUsd);
  const [mcToTvlRatio, setMcToTvlRatio] = useState(initialSliders.mcToTvlRatio);
  const [burnedTokens, setBurnedTokens] = useState(initialSliders.burnedTokens);
  const [holderQuantity, setHolderQuantity] = useState(
    initialSliders.holderQuantity,
  );
  const [simulatorMode, setSimulatorMode] = useState<SimulatorMode>("simple");
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
    <div className="flex min-h-dvh w-full flex-col px-4 pt-6 sm:px-6 sm:pt-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <header className="flex w-full shrink-0 flex-col items-center pb-5 text-center sm:pb-6">
          <div className="flex justify-center">
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
        </header>

        <div className="w-full">
          <section className="rounded-3xl border border-white/[0.1] bg-[#0b0b0f]/[0.94] p-5 shadow-2xl shadow-black/50 ring-1 ring-inset ring-white/[0.06] backdrop-blur-xl sm:p-6 md:p-8">
            <div className="mb-6 text-center md:mb-8">
              <h1 className="mx-auto max-w-xl text-balance bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl md:text-[2rem]">
                IXS price simulator
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-pretty text-xs leading-relaxed text-zinc-500 sm:mt-4 sm:text-sm">
                Supply {formatInteger(totalSupply)} IXS · scenario MC ={" "}
                <span className="font-medium text-zinc-400">
                  MC/TVL × TVL
                </span>
                · implied IXS price = scenario MC ÷ circulating supply · stack
                = balance × price.
              </p>
              <div
                className="mx-auto mt-5 h-px max-w-[12rem] bg-gradient-to-r from-transparent via-[#2564dd]/60 to-transparent"
                aria-hidden
              />
            </div>

            <SimulatorModeTabs
              mode={simulatorMode}
              onModeChange={setSimulatorMode}
            />

            <div className="grid grid-cols-1 gap-5 md:gap-6 md:gap-x-8 md:[grid-template-columns:repeat(2,minmax(min-content,1fr))]">
              <div className="flex min-w-min flex-col gap-5 rounded-2xl md:bg-zinc-950/50 md:p-5 md:ring-1 md:ring-white/[0.06]">
                <RangeSlider
                    id="tvl"
                    label="TVL"
                    labelIcon={<IconTvl />}
                    min={SLIDER_TVL.min}
                    max={SLIDER_TVL.max}
                    step={SLIDER_TVL.step}
                    inputMin={0}
                    inputMax={SLIDER_TVL.max}
                    value={tvlUsd}
                    onChange={setTvlUsd}
                    hint="Total value locked."
                    manualSuffix="USD"
                    manualNudgeStep={MANUAL_NUDGE_USD_SCENARIO}
                  />
                  <RangeSlider
                    id="mc-tvl-ratio"
                    label="MC/TVL (scenario)"
                    labelIcon={<IconMcTvlRatio />}
                    min={SLIDER_MC_TO_TVL_RATIO.min}
                    max={SLIDER_MC_TO_TVL_RATIO.max}
                    step={SLIDER_MC_TO_TVL_RATIO.step}
                    inputMin={0}
                    inputMax={INPUT_MAX_MC_TO_TVL_RATIO}
                    value={mcToTvlRatio}
                    onChange={setMcToTvlRatio}
                    hint="Scenario market cap = this ratio × TVL."
                    manualNudgeStep={MANUAL_NUDGE_MC_TO_TVL}
                  />
                </div>

                <div className="flex min-w-min flex-col gap-5 rounded-2xl md:bg-zinc-950/50 md:p-5 md:ring-1 md:ring-white/[0.06]">
                  <RangeSlider
                    id="burned"
                    label="Burned tokens"
                    labelIcon={<IconBurned />}
                    min={burnedSlider.min}
                    max={burnedSlider.max}
                    step={burnedSlider.step}
                    inputMin={0}
                    inputMax={INPUT_MAX_IXS}
                    value={burnedTokens}
                    onChange={setBurnedTokens}
                    manualSuffix="IXS"
                    integerOnly
                    manualNudgeStep={MANUAL_NUDGE_IXS_BURN}
                  />
                  <RangeSlider
                    id="holder"
                    label={holderBalanceLabel}
                    labelIcon={<IconHolderBalance />}
                    min={SLIDER_HOLDER.min}
                    max={SLIDER_HOLDER.max}
                    step={SLIDER_HOLDER.step}
                    inputMin={0}
                    inputMax={INPUT_MAX_IXS}
                    value={holderQuantity}
                    onChange={setHolderQuantity}
                    hint="Share of circulating is shown in the label."
                    manualSuffix="IXS"
                    manualNudgeStep={MANUAL_NUDGE_IXS_HOLDER}
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
                    = MC/TVL × TVL = {formatNumber(mcToTvlRatio)} ×{" "}
                    {formatUsdCompact(tvlUsd)}
                  </p>
                </div>
              </div>

              {!parsed.ok ? (
                <div className="col-span-full flex justify-center">
                  <SimulationShareControl
                    result={null}
                    totalSupply={totalSupply}
                  />
                </div>
              ) : null}

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
                    {formatUsdCompact(parsed.result.marketCapUsd)} · MC/TVL{" "}
                    {formatNumber(parsed.result.mcToTvlRatio)}
                  </p>
                  <div className="mt-6 flex justify-center border-t border-white/[0.08] pt-5 sm:mt-8 sm:pt-6">
                    <SimulationShareControl
                      result={parsed.result}
                      totalSupply={totalSupply}
                    />
                  </div>
                </div>
              ) : null}

              {simulatorMode === "advanced" ? (
                <AdvancedFeePanel
                  scenarioIxsPriceUsd={
                    parsed.ok ? parsed.result.priceUsd : null
                  }
                />
              ) : null}
          </section>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
