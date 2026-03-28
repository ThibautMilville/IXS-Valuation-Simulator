"use client";

import {
  FIELD_ICON_CLASS,
  IconModeAdvanced,
  IconModeSimple,
} from "@/components/icons/SimulatorUiIcons";

export type SimulatorMode = "simple" | "advanced";

type SimulatorModeTabsProps = {
  mode: SimulatorMode;
  onModeChange: (mode: SimulatorMode) => void;
};

export function SimulatorModeTabs({
  mode,
  onModeChange,
}: SimulatorModeTabsProps) {
  return (
    <div
      className="mb-6 flex shrink-0 justify-center md:mb-8"
      role="tablist"
      aria-label="Simulator mode"
    >
      <div className="flex h-10 shrink-0 items-stretch rounded-xl border border-white/[0.1] bg-zinc-950/80 p-0.5 ring-1 ring-inset ring-white/[0.05] sm:h-11">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "simple"}
          className={`flex min-w-[5.5rem] cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-xs font-medium leading-none transition-colors sm:min-w-[7rem] sm:px-5 sm:text-sm ${
            mode === "simple"
              ? "bg-[#2564dd]/25 text-white shadow-sm ring-1 ring-[#2564dd]/40"
              : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
          }`}
          onClick={() => onModeChange("simple")}
        >
          <span className={FIELD_ICON_CLASS}>
            <IconModeSimple />
          </span>
          <span className="leading-snug">Simple</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "advanced"}
          className={`flex min-w-[5.5rem] cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-xs font-medium leading-none transition-colors sm:min-w-[7rem] sm:px-5 sm:text-sm ${
            mode === "advanced"
              ? "bg-[#2564dd]/25 text-white shadow-sm ring-1 ring-[#2564dd]/40"
              : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
          }`}
          onClick={() => onModeChange("advanced")}
        >
          <span className={FIELD_ICON_CLASS}>
            <IconModeAdvanced />
          </span>
          <span className="leading-snug">Advanced</span>
        </button>
      </div>
    </div>
  );
}
