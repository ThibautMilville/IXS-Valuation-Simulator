type RangeSliderProps = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  hint?: string;
};

export function RangeSlider({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
  hint,
}: RangeSliderProps) {
  const span = max - min;
  const pct = span > 0 ? ((value - min) / span) * 100 : 0;
  const clampedPct = Math.min(100, Math.max(0, pct));

  return (
    <div className="group flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[13px] font-medium tracking-wide text-zinc-400"
        >
          {label}
        </label>
        <output
          htmlFor={id}
          className="font-mono text-sm font-medium tabular-nums text-white"
        >
          {formatValue(value)}
        </output>
      </div>
      <div className="relative flex h-9 w-full items-center">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-zinc-800/95 ring-1 ring-white/[0.04]"
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute left-0 top-1/2 h-2.5 max-w-full -translate-y-1/2 ${clampedPct >= 99.5 ? "rounded-full" : "rounded-l-full"}`}
          style={{
            width: `${clampedPct}%`,
            background: "linear-gradient(90deg, #2564dd00, #2564dd 78%)",
            boxShadow: "0 0 20px rgba(37, 100, 221, 0.28)",
          }}
          aria-hidden
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="ixs-range relative z-10 h-9 w-full cursor-pointer bg-transparent"
        />
      </div>
      {hint ? (
        <p className="text-[11px] leading-relaxed text-zinc-600">{hint}</p>
      ) : null}
    </div>
  );
}
