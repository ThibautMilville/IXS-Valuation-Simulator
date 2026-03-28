"use client";

import type { ReactNode } from "react";
import type { IxsSimulatorResult } from "@/lib/ixs-simulator";
import {
  formatInteger,
  formatNumber,
  formatPercent,
  formatUsd,
  formatUsdCompact,
  formatUsdPrice,
} from "@/lib/format-numbers";
import {
  FIELD_ICON_CLASS,
  IconBurned,
  IconCirculatingSupply,
  IconFdv,
  IconHolderBalance,
  IconImpliedPrice,
  IconMcTvlRatio,
  IconScenarioMc,
  IconStackValue,
  IconTvl,
} from "@/components/icons/SimulatorUiIcons";
import { IxsLogo } from "@/components/ixs/IxsLogo";

type SimulationShareCardProps = {
  result: IxsSimulatorResult;
  totalSupply: number;
  pageUrl: string;
  className?: string;
};

type StatRowProps = {
  label: string;
  value: string;
  emphasize?: boolean;
  borderBottom?: boolean;
  labelIcon?: ReactNode;
};

function StatRow({
  label,
  value,
  emphasize,
  borderBottom = true,
  labelIcon,
}: StatRowProps) {
  return (
    <div
      className={`flex w-full items-center justify-between gap-4 py-2.5 ${
        borderBottom ? "border-b border-white/[0.06]" : ""
      } ${emphasize ? "pt-1" : ""}`}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2 text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-zinc-500">
        {labelIcon ? (
          <span className={FIELD_ICON_CLASS}>{labelIcon}</span>
        ) : null}
        <span className="min-w-0 leading-snug">{label}</span>
      </span>
      <span
        className={`max-w-[58%] shrink-0 self-center text-right font-mono text-xs tabular-nums leading-none text-zinc-100 sm:text-sm ${
          emphasize ? "text-sm font-semibold text-white sm:text-base" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function SimulationShareCard({
  result,
  totalSupply,
  pageUrl,
  className = "",
}: SimulationShareCardProps) {
  const burnedTokens = totalSupply - result.circulatingSupply;
  const displayUrl =
    pageUrl.length > 48 ? `${pageUrl.slice(0, 44)}…` : pageUrl;

  return (
    <div
      className={`relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#2564dd]/25 bg-[#0b0b0f] bg-gradient-to-b from-[#12121a] via-[#0b0b0f] to-[#08080c] p-6 shadow-2xl shadow-black/60 ring-1 ring-inset ring-white/[0.06] sm:p-8 ${className}`}
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-col items-center gap-1 border-b border-white/[0.08] pb-5 text-center">
          <IxsLogo className="h-8 w-auto text-white sm:h-9" />
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#93b4f0]">
            Simulation summary
          </p>
        </div>
        <div className="mt-1 flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <StatRow
              label="Stack value"
              value={formatUsd(result.holderValueUsd)}
              emphasize
              labelIcon={<IconStackValue />}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <StatRow
              label="Implied IXS price"
              value={formatUsdPrice(result.priceUsd)}
              labelIcon={<IconImpliedPrice />}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <StatRow
              label="Scenario market cap"
              value={formatUsdCompact(result.marketCapUsd)}
              labelIcon={<IconScenarioMc />}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <StatRow
              label="TVL"
              value={formatUsdCompact(result.tvlUsd)}
              labelIcon={<IconTvl />}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <StatRow
              label="MC/TVL (scenario)"
              value={formatNumber(result.mcToTvlRatio)}
              labelIcon={<IconMcTvlRatio />}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <StatRow
              label="Balance"
              value={`${formatInteger(result.holderQuantity)} IXS`}
              labelIcon={<IconHolderBalance />}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <StatRow
              label="Circulating supply"
              value={`${formatInteger(result.circulatingSupply)} IXS`}
              labelIcon={<IconCirculatingSupply />}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <StatRow
              label="Burned"
              value={`${formatInteger(burnedTokens)} (${formatPercent(
                result.burnPercentOfMax,
                2,
              )})`}
              labelIcon={<IconBurned />}
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <StatRow
              label="FDV (scenario)"
              value={formatUsdCompact(result.fdvUsd)}
              borderBottom={false}
              labelIcon={<IconFdv />}
            />
          </div>
        </div>
        {pageUrl ? (
          <p className="mt-4 shrink-0 truncate text-center font-mono text-[10px] text-zinc-600">
            {displayUrl}
          </p>
        ) : null}
      </div>
    </div>
  );
}
