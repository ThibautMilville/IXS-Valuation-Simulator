"use client";

import { useMemo, useState } from "react";
import {
  computeIxsSimulation,
  IXS_MAX_SUPPLY,
} from "@/lib/ixs-simulator";
import {
  SLIDER_BURNED,
  SLIDER_HOLDER,
  SLIDER_MARKET_CAP,
  SLIDER_TVL,
} from "@/lib/slider-ranges";
import {
  formatInteger,
  formatNumber,
  formatPercent,
  formatUsd,
  formatUsdCompact,
} from "@/lib/format-numbers";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { StatCard } from "@/components/ui/StatCard";
import { IxsLogo } from "@/components/ixs/IxsLogo";

export function IxsSimulatorView() {
  const [marketCapUsd, setMarketCapUsd] = useState(50_000_000);
  const [tvlUsd, setTvlUsd] = useState(12_000_000);
  const [burnedTokens, setBurnedTokens] = useState(972_000);
  const [holderQuantity, setHolderQuantity] = useState(10_000);

  const parsed = useMemo(() => {
    const result = computeIxsSimulation({
      marketCapUsd,
      tvlUsd,
      burnedTokens,
      holderQuantity,
    });
    if (result === null) {
      return { ok: false as const, error: "supply" as const };
    }
    return { ok: true as const, result };
  }, [marketCapUsd, tvlUsd, burnedTokens, holderQuantity]);

  const errorMessage =
    parsed.ok === false && parsed.error === "supply"
      ? `Burned tokens must stay below max supply (${formatInteger(IXS_MAX_SUPPLY)} IXS).`
      : null;

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-5 py-14 sm:px-8 sm:py-20">
      <div className="flex w-full max-w-md flex-col items-center">
        <header className="mb-12 flex w-full flex-col items-center text-center">
          <div className="mb-7 flex w-full justify-center">
            <div className="flex h-12 w-48 items-center justify-center">
              <IxsLogo className="h-11 w-auto text-white drop-shadow-[0_0_28px_rgb(37_100_221_/_0.35)]" />
            </div>
          </div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
            IXS price simulator
          </h1>
          <p className="mt-3 max-w-[22rem] text-pretty text-sm leading-relaxed text-zinc-500">
            Move the sliders. Max supply {formatInteger(IXS_MAX_SUPPLY)} IXS —
            implied price = market cap ÷ (max − burned).
          </p>
        </header>

        <section className="w-full rounded-[1.75rem] border border-white/[0.08] bg-zinc-950/50 p-7 shadow-[0_24px_80px_-12px_rgb(0_0_0_/_0.65)] backdrop-blur-2xl ring-1 ring-white/[0.04] sm:p-8">
          <h2 className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Inputs
          </h2>
          <div className="flex flex-col gap-9">
            <RangeSlider
              id="mcap"
              label="Market cap"
              min={SLIDER_MARKET_CAP.min}
              max={SLIDER_MARKET_CAP.max}
              step={SLIDER_MARKET_CAP.step}
              value={marketCapUsd}
              onChange={setMarketCapUsd}
              formatValue={(v) => formatUsdCompact(v)}
              hint="Total market capitalization in USD."
            />
            <RangeSlider
              id="tvl"
              label="TVL"
              min={SLIDER_TVL.min}
              max={SLIDER_TVL.max}
              step={SLIDER_TVL.step}
              value={tvlUsd}
              onChange={setTvlUsd}
              formatValue={(v) => formatUsdCompact(v)}
              hint="Total value locked — compare to market cap below."
            />
            <RangeSlider
              id="burned"
              label="Burned tokens"
              min={SLIDER_BURNED.min}
              max={SLIDER_BURNED.max}
              step={SLIDER_BURNED.step}
              value={burnedTokens}
              onChange={setBurnedTokens}
              formatValue={(v) => `${formatInteger(v)} IXS`}
            />
            <RangeSlider
              id="holder"
              label="Holder balance"
              min={SLIDER_HOLDER.min}
              max={SLIDER_HOLDER.max}
              step={SLIDER_HOLDER.step}
              value={holderQuantity}
              onChange={setHolderQuantity}
              formatValue={(v) => `${formatInteger(v)} IXS`}
              hint="Your IXS balance to estimate USD value."
            />
          </div>
        </section>

        <div className="mt-10 w-full space-y-4">
          {errorMessage ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-950/25 px-4 py-3 text-center text-sm text-amber-100/90 backdrop-blur-sm">
              {errorMessage}
            </div>
          ) : null}

          {parsed.ok ? (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <StatCard
                  label="Implied price"
                  value={formatUsd(parsed.result.priceUsd)}
                  sublabel="Per IXS token"
                  emphasize
                />
                <StatCard
                  label="Your position value"
                  value={formatUsd(parsed.result.holderValueUsd)}
                  sublabel={`${formatNumber(parsed.result.holderQuantity)} IXS × implied price`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Circulating supply"
                  value={`${formatInteger(parsed.result.circulatingSupply)}`}
                  sublabel="IXS · max − burned"
                />
                <StatCard
                  label="FDV"
                  value={formatUsdCompact(parsed.result.fdvUsd)}
                  sublabel="Max supply"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="TVL / MC"
                  value={formatPercent(parsed.result.tvlToMcRatio * 100, 2)}
                />
                <StatCard
                  label="Burned / max"
                  value={formatPercent(parsed.result.burnPercentOfMax, 2)}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
