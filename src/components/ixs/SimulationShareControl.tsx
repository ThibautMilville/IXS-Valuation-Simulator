"use client";

import { useState } from "react";
import type { IxsSimulatorResult } from "@/lib/ixs-simulator";
import { FIELD_ICON_CLASS } from "@/components/icons/SimulatorUiIcons";
import { SimulationShareModal } from "@/components/ixs/SimulationShareModal";

const SHARE_BTN_CLASS =
  "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-zinc-950/80 px-4 text-xs font-medium leading-none text-zinc-200 shadow-sm ring-1 ring-inset ring-white/[0.05] transition-colors hover:border-[#2564dd]/35 hover:bg-[#2564dd]/[0.12] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:px-5 sm:text-sm";

function ShareIcon() {
  return (
    <span className={FIELD_ICON_CLASS}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
      </svg>
    </span>
  );
}

function ShareDisabledButton() {
  return (
    <div className="mx-auto flex justify-center">
      <button type="button" disabled className={SHARE_BTN_CLASS}>
        <ShareIcon />
        <span className="leading-snug">Share</span>
      </button>
    </div>
  );
}

type SimulationShareControlActiveProps = {
  result: IxsSimulatorResult;
  totalSupply: number;
};

function SimulationShareControlActive({
  result,
  totalSupply,
}: SimulationShareControlActiveProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="mx-auto flex justify-center">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={SHARE_BTN_CLASS}
        >
          <ShareIcon />
          <span className="leading-snug">Share</span>
        </button>
      </div>
      <SimulationShareModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        result={result}
        totalSupply={totalSupply}
      />
    </>
  );
}

type SimulationShareControlProps = {
  result: IxsSimulatorResult | null;
  totalSupply: number;
};

export function SimulationShareControl({
  result,
  totalSupply,
}: SimulationShareControlProps) {
  if (!result) {
    return <ShareDisabledButton />;
  }
  return (
    <SimulationShareControlActive result={result} totalSupply={totalSupply} />
  );
}
