"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  aggregateAdvancedFees,
  computeAdvancedFeeLines,
} from "@/lib/advanced-fee-model";
import {
  INPUT_MAX_USD,
  SLIDER_BTC_YIELD_FEE_PERCENT,
  SLIDER_LAUNCHPAD_FEE_PERCENT,
  SLIDER_TVL,
} from "@/lib/slider-ranges";
import {
  MANUAL_NUDGE_PERCENT_BTC_FEE,
  MANUAL_NUDGE_PERCENT_LAUNCHPAD,
  MANUAL_NUDGE_USD_FLAT,
  MANUAL_NUDGE_USD_SCENARIO,
} from "@/lib/simulator-constants";
import {
  formatNumber,
  formatPercent,
  formatUsd,
  formatUsdPrice,
} from "@/lib/format-numbers";
import { RangeSlider } from "@/components/ui/RangeSlider";
import {
  FIELD_ICON_CLASS,
  IconBtc,
  IconLaunchpad,
  IconLpListing,
  IconLpSwap,
  IconSaas,
} from "@/components/icons/SimulatorUiIcons";

function CollapsibleFeeCard({
  cardId,
  title,
  icon,
  description,
  children,
  defaultOpen = true,
}: {
  cardId: string;
  title: string;
  icon?: ReactNode;
  description: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `fee-card-${cardId}`;
  const triggerId = `${panelId}-trigger`;

  return (
    <div className="min-w-min overflow-x-auto overflow-y-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/50 ring-1 ring-white/[0.04]">
      <button
        type="button"
        id={triggerId}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2564dd]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0f] sm:px-5 sm:py-4"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <h3 className="flex min-w-0 items-center gap-2 text-sm font-semibold leading-none text-white">
          {icon ? (
            <span className={FIELD_ICON_CLASS}>{icon}</span>
          ) : null}
          <span className="min-w-0 leading-snug">{title}</span>
        </h3>
        <svg
          className={`size-5 shrink-0 text-zinc-500 transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className="border-t border-white/[0.06] px-4 pb-4 pt-1 sm:px-5 sm:pb-5"
        >
          <div className="mt-2 space-y-1 text-[11px] leading-relaxed text-zinc-500 sm:text-xs">
            {description}
          </div>
          <div className="mt-4 space-y-4">{children}</div>
        </div>
      ) : null}
    </div>
  );
}

function FeeResultRow({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-white/[0.06] pt-2 font-mono text-[10px] tabular-nums text-zinc-400 first:border-t-0 first:pt-0 sm:text-xs">
      <span className="min-w-0 shrink text-zinc-500">{label}</span>
      <span className="min-w-0 shrink-0 text-right text-zinc-200">
        <span className="block">{value}</span>
        {detail ? (
          <span className="mt-0.5 block text-[9px] font-normal text-zinc-500 sm:text-[10px]">
            {detail}
          </span>
        ) : null}
      </span>
    </div>
  );
}

function burnIxsAtPriceDetail(
  burnUsd: number,
  priceUsd: number | null,
): string | undefined {
  if (
    priceUsd === null ||
    priceUsd <= 0 ||
    !Number.isFinite(burnUsd) ||
    burnUsd <= 0
  ) {
    return undefined;
  }
  const ix = burnUsd / priceUsd;
  if (!Number.isFinite(ix) || ix <= 0) {
    return undefined;
  }
  return `≈ ${formatNumber(ix)} IXS @ ${formatUsdPrice(priceUsd)}`;
}

type AdvancedFeePanelProps = {
  scenarioIxsPriceUsd: number | null;
};

export function AdvancedFeePanel({
  scenarioIxsPriceUsd,
}: AdvancedFeePanelProps) {
  const [lpSwapVolumeUsd, setLpSwapVolumeUsd] = useState(0);
  const [lpListingFlatFeeUsd, setLpListingFlatFeeUsd] = useState(0);
  const [launchpadRaisedUsd, setLaunchpadRaisedUsd] = useState(0);
  const [launchpadFeePercentPoints, setLaunchpadFeePercentPoints] =
    useState(2);
  const [btcBorrowUsd, setBtcBorrowUsd] = useState(0);
  const [btcYieldFeePercentPoints, setBtcYieldFeePercentPoints] =
    useState(0.5);
  const [saasFlatUsd, setSaasFlatUsd] = useState(0);
  const [saasMonthlyUsd, setSaasMonthlyUsd] = useState(0);

  const lines = useMemo(
    () =>
      computeAdvancedFeeLines({
        lpSwapVolumeUsd,
        lpListingFlatFeeUsd,
        launchpadRaisedUsd,
        launchpadFeePercentPoints,
        btcBorrowUsd,
        btcYieldFeePercentPoints,
        saasFlatUsd,
        saasMonthlyUsd,
      }),
    [
      lpSwapVolumeUsd,
      lpListingFlatFeeUsd,
      launchpadRaisedUsd,
      launchpadFeePercentPoints,
      btcBorrowUsd,
      btcYieldFeePercentPoints,
      saasFlatUsd,
      saasMonthlyUsd,
    ],
  );

  const totals = useMemo(() => aggregateAdvancedFees(lines), [lines]);

  const byId = useMemo(() => {
    const m = new Map(lines.map((l) => [l.id, l]));
    return {
      lpSwap: m.get("lp-swap")!,
      lpList: m.get("lp-listing")!,
      launchpad: m.get("launchpad")!,
      btc: m.get("btc-yield")!,
      saas: m.get("saas")!,
    };
  }, [lines]);

  return (
    <div className="mt-8 space-y-5 border-t border-white/[0.08] pt-8">
      <div className="text-center">
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          Protocol fee flows (IXS)
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-[11px] leading-relaxed text-zinc-500 sm:text-xs">
          Configurable assumptions for each line. Percentages below are shares
          of the fee collected, not of gross volume.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:[grid-template-columns:repeat(2,minmax(min-content,1fr))]">
        <CollapsibleFeeCard
          cardId="lp-swap"
          title="Liquidity pool swap fees"
          icon={<IconLpSwap />}
          description={
            <>
              <p>
                Fee: <span className="text-zinc-400">1%</span> of total swap
                value.
              </p>
              <p>
                <span className="text-zinc-400">5%</span> of the fee → buy back
                IXS · <span className="text-zinc-400">5%</span> of the fee →
                buy back &amp; burn IXS.
              </p>
            </>
          }
        >
          <RangeSlider
            id="adv-lp-swap-vol"
            label="Swap volume (basis)"
            min={SLIDER_TVL.min}
            max={SLIDER_TVL.max}
            step={SLIDER_TVL.step}
            inputMin={0}
            inputMax={SLIDER_TVL.max}
            value={lpSwapVolumeUsd}
            onChange={setLpSwapVolumeUsd}
            hint="Volume the 1% fee applies to (e.g. monthly)."
            manualSuffix="USD"
            manualNudgeStep={MANUAL_NUDGE_USD_SCENARIO}
          />
          <FeeResultRow
            label="Protocol fee (1%)"
            value={formatUsd(byId.lpSwap.totalFeeUsd)}
          />
          <FeeResultRow
            label="Buyback allocation (5% of fee)"
            value={formatUsd(byId.lpSwap.buybackFromFeeUsd)}
          />
          <FeeResultRow
            label="Buyback & burn (5% of fee)"
            value={formatUsd(byId.lpSwap.burnFromFeeUsd)}
            detail={burnIxsAtPriceDetail(
              byId.lpSwap.burnFromFeeUsd,
              scenarioIxsPriceUsd,
            )}
          />
        </CollapsibleFeeCard>

        <CollapsibleFeeCard
          cardId="lp-listing"
          title="Liquidity pool listing"
          icon={<IconLpListing />}
          description={
            <>
              <p>Fee: variable flat fee (negotiable).</p>
              <p>
                <span className="text-zinc-400">5%</span> of the fee → buy back
                IXS · <span className="text-zinc-400">5%</span> → buy back
                &amp; burn IXS.
              </p>
            </>
          }
        >
          <RangeSlider
            id="adv-lp-listing"
            label="Listing fee (flat)"
            min={0}
            max={5_000_000}
            step="any"
            inputMin={0}
            inputMax={INPUT_MAX_USD}
            value={lpListingFlatFeeUsd}
            onChange={setLpListingFlatFeeUsd}
            manualSuffix="USD"
            manualNudgeStep={MANUAL_NUDGE_USD_FLAT}
          />
          <FeeResultRow
            label="Total listing fee"
            value={formatUsd(byId.lpList.totalFeeUsd)}
          />
          <FeeResultRow
            label="Buyback (5% of fee)"
            value={formatUsd(byId.lpList.buybackFromFeeUsd)}
          />
          <FeeResultRow
            label="Buyback & burn (5% of fee)"
            value={formatUsd(byId.lpList.burnFromFeeUsd)}
            detail={burnIxsAtPriceDetail(
              byId.lpList.burnFromFeeUsd,
              scenarioIxsPriceUsd,
            )}
          />
        </CollapsibleFeeCard>

        <CollapsibleFeeCard
          cardId="launchpad"
          title="Launchpad listing"
          icon={<IconLaunchpad />}
          description={
            <>
              <p>Fee: variable % of total amount raised.</p>
              <p>
                <span className="text-zinc-400">15%</span> of the fee → buy
                back IXS · <span className="text-zinc-400">15%</span> → buy
                back &amp; burn IXS.
              </p>
            </>
          }
        >
          <RangeSlider
            id="adv-launchpad-raised"
            label="Amount raised"
            min={0}
            max={SLIDER_TVL.max}
            step={SLIDER_TVL.step}
            inputMin={0}
            inputMax={SLIDER_TVL.max}
            value={launchpadRaisedUsd}
            onChange={setLaunchpadRaisedUsd}
            manualSuffix="USD"
            manualNudgeStep={MANUAL_NUDGE_USD_SCENARIO}
          />
          <RangeSlider
            id="adv-launchpad-pct"
            label="Listing fee rate"
            min={SLIDER_LAUNCHPAD_FEE_PERCENT.min}
            max={SLIDER_LAUNCHPAD_FEE_PERCENT.max}
            step={SLIDER_LAUNCHPAD_FEE_PERCENT.step}
            inputMin={0}
            inputMax={100}
            value={launchpadFeePercentPoints}
            onChange={setLaunchpadFeePercentPoints}
            hint="Percent of raised amount taken as fee."
            manualSuffix="%"
            manualNudgeStep={MANUAL_NUDGE_PERCENT_LAUNCHPAD}
          />
          <FeeResultRow
            label="Protocol fee"
            value={formatUsd(byId.launchpad.totalFeeUsd)}
          />
          <FeeResultRow
            label="Buyback (15% of fee)"
            value={formatUsd(byId.launchpad.buybackFromFeeUsd)}
          />
          <FeeResultRow
            label="Buyback & burn (15% of fee)"
            value={formatUsd(byId.launchpad.burnFromFeeUsd)}
            detail={burnIxsAtPriceDetail(
              byId.launchpad.burnFromFeeUsd,
              scenarioIxsPriceUsd,
            )}
          />
        </CollapsibleFeeCard>

        <CollapsibleFeeCard
          cardId="btc-yield"
          title="BTC yield program"
          icon={<IconBtc />}
          description={
            <>
              <p>Fee: variable % of borrow amount (baseline often ~0.5%).</p>
              <p>
                <span className="text-zinc-400">10%</span> of the fee → buy
                back IXS · <span className="text-zinc-400">10%</span> → buy
                back &amp; burn IXS.
              </p>
            </>
          }
        >
          <RangeSlider
            id="adv-btc-borrow"
            label="Borrow amount (basis)"
            min={0}
            max={SLIDER_TVL.max}
            step={SLIDER_TVL.step}
            inputMin={0}
            inputMax={SLIDER_TVL.max}
            value={btcBorrowUsd}
            onChange={setBtcBorrowUsd}
            manualSuffix="USD"
            manualNudgeStep={MANUAL_NUDGE_USD_SCENARIO}
          />
          <RangeSlider
            id="adv-btc-fee-pct"
            label="Program fee rate"
            min={SLIDER_BTC_YIELD_FEE_PERCENT.min}
            max={SLIDER_BTC_YIELD_FEE_PERCENT.max}
            step={SLIDER_BTC_YIELD_FEE_PERCENT.step}
            inputMin={0.25}
            inputMax={3}
            value={btcYieldFeePercentPoints}
            onChange={setBtcYieldFeePercentPoints}
            hint={`Typical range ${formatPercent(0.5, 2)}–${formatPercent(1, 2)}.`}
            manualSuffix="%"
            manualNudgeStep={MANUAL_NUDGE_PERCENT_BTC_FEE}
          />
          <FeeResultRow
            label="Protocol fee"
            value={formatUsd(byId.btc.totalFeeUsd)}
          />
          <FeeResultRow
            label="Buyback (10% of fee)"
            value={formatUsd(byId.btc.buybackFromFeeUsd)}
          />
          <FeeResultRow
            label="Buyback & burn (10% of fee)"
            value={formatUsd(byId.btc.burnFromFeeUsd)}
            detail={burnIxsAtPriceDetail(
              byId.btc.burnFromFeeUsd,
              scenarioIxsPriceUsd,
            )}
          />
        </CollapsibleFeeCard>

        <CollapsibleFeeCard
          cardId="saas"
          title="SaaS"
          icon={<IconSaas />}
          description={
            <>
              <p>Fee: variable flat fee and monthly fee.</p>
              <p>
                <span className="text-zinc-400">10%</span> of the fee → buy
                back IXS · <span className="text-zinc-400">10%</span> → buy
                back &amp; burn IXS.
              </p>
            </>
          }
        >
          <RangeSlider
            id="adv-saas-flat"
            label="Flat fee (period)"
            min={0}
            max={5_000_000}
            step="any"
            inputMin={0}
            inputMax={INPUT_MAX_USD}
            value={saasFlatUsd}
            onChange={setSaasFlatUsd}
            manualSuffix="USD"
            manualNudgeStep={MANUAL_NUDGE_USD_FLAT}
          />
          <RangeSlider
            id="adv-saas-monthly"
            label="Monthly fee"
            min={0}
            max={1_000_000}
            step="any"
            inputMin={0}
            inputMax={INPUT_MAX_USD}
            value={saasMonthlyUsd}
            onChange={setSaasMonthlyUsd}
            hint="Added to flat for one-period total below."
            manualSuffix="USD"
            manualNudgeStep={MANUAL_NUDGE_USD_FLAT}
          />
          <FeeResultRow
            label="Fee basis (flat + monthly)"
            value={formatUsd(byId.saas.totalFeeUsd)}
          />
          <FeeResultRow
            label="Buyback (10% of fee)"
            value={formatUsd(byId.saas.buybackFromFeeUsd)}
          />
          <FeeResultRow
            label="Buyback & burn (10% of fee)"
            value={formatUsd(byId.saas.burnFromFeeUsd)}
            detail={burnIxsAtPriceDetail(
              byId.saas.burnFromFeeUsd,
              scenarioIxsPriceUsd,
            )}
          />
        </CollapsibleFeeCard>
      </div>

      <div className="rounded-2xl border border-[#2564dd]/25 bg-[#2564dd]/[0.06] p-4 sm:p-5">
        <h3 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#93b4f0]">
          Combined (this scenario)
        </h3>
        <div className="mt-3 space-y-2 font-mono text-xs tabular-nums sm:text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Total protocol fees</span>
            <span className="text-white">{formatUsd(totals.totalFeeUsd)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Total buyback slice</span>
            <span className="text-white">
              {formatUsd(totals.buybackFromFeeUsd)}
            </span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Total buyback &amp; burn slice</span>
            <span className="text-white">
              {formatUsd(totals.burnFromFeeUsd)}
            </span>
          </div>
          <div className="flex justify-between gap-3 text-zinc-400">
            <span className="min-w-0">
              Buyback &amp; burn in IXS
              <span className="mt-0.5 block text-[10px] font-normal normal-case tracking-normal text-zinc-600">
                At implied IXS price from the simulator
              </span>
            </span>
            <span className="shrink-0 text-right text-white">
              {scenarioIxsPriceUsd !== null &&
              scenarioIxsPriceUsd > 0 &&
              totals.burnFromFeeUsd > 0 ? (
                <>
                  <span className="block font-mono tabular-nums">
                    ≈ {formatNumber(totals.burnFromFeeUsd / scenarioIxsPriceUsd)}{" "}
                    IXS
                  </span>
                  <span className="mt-0.5 block text-[10px] font-normal text-zinc-500">
                    @ {formatUsdPrice(scenarioIxsPriceUsd)}
                  </span>
                </>
              ) : (
                <span className="text-zinc-500">—</span>
              )}
            </span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-2 text-zinc-300">
            <span>IXS-directed share of fees</span>
            <span className="text-white">
              {formatUsd(
                totals.buybackFromFeeUsd + totals.burnFromFeeUsd,
              )}{" "}
              <span className="text-zinc-500">
                (
                {totals.totalFeeUsd > 0
                  ? formatNumber(
                      ((totals.buybackFromFeeUsd + totals.burnFromFeeUsd) /
                        totals.totalFeeUsd) *
                        100,
                    )
                  : "0"}
                % of fees)
              </span>
            </span>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] leading-relaxed text-zinc-600 sm:text-xs">
        Some fees are negotiated or tailored per client; figures here are
        illustrative. The main price simulator above is unchanged - this panel
        estimates fee splits only.
      </p>
    </div>
  );
}
