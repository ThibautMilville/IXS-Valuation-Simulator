"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { clamp } from "@/lib/clamp";
import {
  formatInputBlurred,
  formatInputEditMode,
  maxInputDisplayLenInRange,
} from "@/lib/format-numbers";
import { parseDecimalInput } from "@/lib/parse-decimal-input";

type RangeSliderProps = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number | "any";
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  manualSuffix?: string;
  integerOnly?: boolean;
  inputMin?: number;
  inputMax?: number;
  manualNudgeStep?: number;
  subline?: ReactNode;
};

export function RangeSlider({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
  hint,
  manualSuffix,
  integerOnly = false,
  inputMin,
  inputMax,
  manualNudgeStep,
  subline,
}: RangeSliderProps) {
  const generatedId = useId();
  const manualId = `${id}-manual-${generatedId}`;
  const [draft, setDraft] = useState<string | null>(null);

  const imin = inputMin ?? min;
  const imax = inputMax ?? max;

  const rangeMax =
    Number.isFinite(value) && value > max
      ? clamp(value, max, imax)
      : max;

  const sliderValue = clamp(
    Number.isFinite(value) ? value : min,
    min,
    rangeMax,
  );

  const span = rangeMax - min;
  const pct = span > 0 ? ((sliderValue - min) / span) * 100 : 0;
  const clampedPct = Math.min(100, Math.max(0, pct));

  const stepAttr = step === "any" ? "any" : step;

  const applyParsed = (raw: string) => {
    const parsed = parseDecimalInput(raw);
    if (parsed === null) {
      return;
    }
    const next = integerOnly
      ? Math.round(parsed)
      : Math.round(parsed * 100) / 100;
    onChange(clamp(next, imin, imax));
  };

  const handleManualChange = (raw: string) => {
    setDraft(raw);
    applyParsed(raw);
  };

  const handleManualBlur = () => {
    if (draft !== null) {
      applyParsed(draft);
    }
    setDraft(null);
  };

  const displayManual =
    draft !== null ? draft : formatInputBlurred(value, integerOnly);

  const defaultNudge =
    typeof step === "number" ? step : integerOnly ? 1 : 0.01;
  const nudgeStep = manualNudgeStep ?? defaultNudge;

  const bump = (delta: number) => {
    const raw = value + delta;
    if (manualNudgeStep !== undefined && manualNudgeStep > 0) {
      let next = raw;
      if (integerOnly) {
        next = Math.round(next);
      } else {
        next = Math.round(next * 100) / 100;
      }
      onChange(clamp(next, imin, imax));
      setDraft(null);
      return;
    }
    const next = integerOnly
      ? Math.round(raw)
      : Math.round(raw * 100) / 100;
    onChange(clamp(next, imin, imax));
    setDraft(null);
  };

  const atMin = clamp(Number.isFinite(value) ? value : min, imin, imax) <= imin;
  const atMax = clamp(Number.isFinite(value) ? value : min, imin, imax) >= imax;

  const inputMinWidthCh = useMemo(() => {
    const fromRangeBlur = maxInputDisplayLenInRange(imin, imax, integerOnly);
    const fromEdit = Math.max(
      formatInputEditMode(imin, integerOnly).length,
      formatInputEditMode(imax, integerOnly).length,
      1,
    );
    const fromLive = Math.max(
      displayManual.length,
      draft !== null ? draft.length : 0,
    );
    return Math.max(3, fromRangeBlur, fromEdit, fromLive) + 2;
  }, [imin, imax, integerOnly, displayManual, draft]);

  return (
    <div className="group flex flex-col gap-1.5 sm:gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <label
          htmlFor={id}
          className="shrink-0 text-xs font-medium tracking-wide text-zinc-400"
        >
          {label}
        </label>
        <div className="flex w-full min-w-min max-w-full shrink-0 justify-end overflow-x-auto sm:ml-auto sm:w-auto">
          <div
            className="flex min-h-9 w-max min-w-min shrink-0 rounded-lg border border-zinc-600/80 bg-zinc-950/70 shadow-inner shadow-black/10 transition-[border-color,box-shadow] focus-within:border-[#2564dd]/55 focus-within:ring-1 focus-within:ring-[#2564dd]/30 sm:min-h-10"
          >
            <button
              type="button"
              aria-label={`Decrease ${label}`}
              disabled={atMin}
              onClick={() => bump(-nudgeStep)}
              className="flex w-9 shrink-0 cursor-pointer items-center justify-center border-r border-zinc-600/80 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
            >
              −
            </button>
            <input
              id={manualId}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              aria-label={`${label} manual value`}
              value={displayManual}
              onChange={(e) => handleManualChange(e.target.value)}
              onFocus={() =>
                setDraft(formatInputEditMode(value, integerOnly))
              }
              onBlur={handleManualBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              style={{
                minWidth: `${inputMinWidthCh}ch`,
                fieldSizing: "content",
              }}
              className="box-border shrink-0 border-0 bg-transparent px-2 py-2 text-right font-mono text-xs tabular-nums text-white outline-none ring-0 focus:ring-0 sm:px-2.5 [field-sizing:content]"
            />
            {manualSuffix ? (
              <span
                className="flex shrink-0 items-center border-l border-zinc-600/80 bg-zinc-950/40 px-2.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 sm:px-3"
                aria-hidden
              >
                {manualSuffix}
              </span>
            ) : null}
            <button
              type="button"
              aria-label={`Increase ${label}`}
              disabled={atMax}
              onClick={() => bump(nudgeStep)}
              className="flex w-9 shrink-0 cursor-pointer items-center justify-center border-l border-zinc-600/80 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="relative flex h-8 w-full items-center">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-zinc-800 ring-1 ring-white/[0.05]"
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute left-0 top-1/2 h-2 max-w-full -translate-y-1/2 ${clampedPct >= 99.5 ? "rounded-full" : "rounded-l-full"}`}
          style={{
            width: `${clampedPct}%`,
            background: "linear-gradient(90deg, #2564dd00, #2564dd 78%)",
            boxShadow: "0 0 14px rgba(37, 100, 221, 0.22)",
          }}
          aria-hidden
        />
        <input
          id={id}
          type="range"
          min={min}
          max={rangeMax}
          step={stepAttr}
          value={sliderValue}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) {
              onChange(clamp(n, imin, imax));
            }
            setDraft(null);
          }}
          className="ixs-range relative z-10 h-8 w-full cursor-pointer bg-transparent"
        />
      </div>
      {subline ? (
        <p className="font-mono text-[10px] leading-relaxed tabular-nums text-zinc-400">
          {subline}
        </p>
      ) : null}
      {hint ? (
        <p className="text-[10px] leading-snug text-zinc-600 lg:hidden">{hint}</p>
      ) : null}
    </div>
  );
}
