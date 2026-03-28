"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { IxsSimulatorResult } from "@/lib/ixs-simulator";
import {
  shareSimulationOnX,
  shareSimulationWithOptionalImage,
} from "@/lib/share-card-capture";
import {
  buildFacebookShareUrl,
  buildLinkedInShareUrl,
  buildRedditSubmitUrl,
  buildTelegramShareUrl,
  buildWhatsAppShareUrl,
} from "@/lib/social-share-links";
import {
  buildSimulationSharePlainText,
  buildSimulationShareTitle,
  buildSimulationTwitterShareText,
  buildTwitterIntentUrl,
} from "@/lib/simulation-share";
import {
  FIELD_ICON_CLASS,
  IconScreenshotHint,
  IconShareUpload,
  IconSocialNetworks,
} from "@/components/icons/SimulatorUiIcons";
import { SimulationShareCard } from "@/components/ixs/SimulationShareCard";
import { SimulationSocialNetworkRow } from "@/components/ixs/SimulationSocialNetworkRow";

type SimulationShareModalProps = {
  open: boolean;
  onClose: () => void;
  result: IxsSimulatorResult;
  totalSupply: number;
};

export function SimulationShareModal({
  open,
  onClose,
  result,
  totalSupply,
}: SimulationShareModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  const fromLocation =
    typeof globalThis.location !== "undefined"
      ? globalThis.location.origin.replace(/\/$/, "")
      : "";
  const siteUrl = fromEnv || fromLocation;

  const input = { result, totalSupply, pageUrl: siteUrl };
  const shareTitle = buildSimulationShareTitle();
  const plainText = buildSimulationSharePlainText(input);
  const twitterText = buildSimulationTwitterShareText(input);

  const links = {
    x: buildTwitterIntentUrl(twitterText, siteUrl),
    facebook: buildFacebookShareUrl(siteUrl),
    linkedin: buildLinkedInShareUrl(siteUrl),
    reddit: buildRedditSubmitUrl(siteUrl, shareTitle),
    telegram: buildTelegramShareUrl(twitterText, siteUrl),
    whatsapp: buildWhatsAppShareUrl(twitterText, siteUrl),
  };

  const runNativeShare = useCallback(async () => {
    const el = cardRef.current;
    if (!el) {
      return;
    }
    setSharing(true);
    try {
      await shareSimulationWithOptionalImage(el, {
        title: shareTitle,
        text: plainText,
        url: siteUrl,
      });
    } finally {
      setSharing(false);
    }
  }, [plainText, siteUrl, shareTitle]);

  const runXShare = useCallback(async () => {
    const el = cardRef.current;
    if (!el) {
      return;
    }
    setSharing(true);
    try {
      await shareSimulationOnX(el, {
        title: shareTitle,
        tweetCaption: twitterText,
        siteUrl,
        intentUrl: buildTwitterIntentUrl(twitterText, siteUrl),
      });
    } finally {
      setSharing(false);
    }
  }, [shareTitle, siteUrl, twitterText]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointer = (ev: MouseEvent) => {
      const el = panelRef.current;
      if (el && !el.contains(ev.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, [onClose, open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const hasNativeShare = typeof navigator.share === "function";

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/75 p-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] backdrop-blur-sm sm:items-center sm:p-6 sm:pb-6"
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(92dvh,900px)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0b0b0f]/95 shadow-2xl ring-1 ring-white/[0.06] backdrop-blur-xl sm:max-w-lg"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 leading-none">
            <span className={FIELD_ICON_CLASS}>
              <IconShareUpload />
            </span>
            <h2
              id={titleId}
              className="min-w-0 truncate text-sm font-semibold leading-snug tracking-tight text-white"
            >
              Share simulation
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-3 py-3 sm:px-5 sm:py-5">
          <p className="mb-3 flex shrink-0 items-center justify-center gap-2 text-center text-xs leading-none text-zinc-500">
            <span className={FIELD_ICON_CLASS}>
              <IconScreenshotHint />
            </span>
            <span className="leading-snug">
              Screenshot, share as image, or open a social app
            </span>
          </p>
          <div className="flex min-h-[min(42dvh,26rem)] flex-1 flex-col">
            <SimulationShareCard
              ref={cardRef}
              result={result}
              totalSupply={totalSupply}
              pageUrl={siteUrl}
              className="min-h-0 flex-1"
            />
          </div>
          {hasNativeShare ? (
            <button
              type="button"
              disabled={sharing}
              onClick={() => void runNativeShare()}
              className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[#2564dd] text-sm font-semibold text-white shadow-lg shadow-[#2564dd]/25 transition-colors hover:bg-[#1f56c4] disabled:cursor-wait disabled:opacity-70"
            >
              {sharing ? "Preparing…" : "Share"}
            </button>
          ) : null}
          <p className="mb-1.5 mt-3 flex items-center justify-center gap-2 text-center text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-zinc-500 sm:mt-4">
            <span className={FIELD_ICON_CLASS}>
              <IconSocialNetworks />
            </span>
            <span className="leading-snug">Social networks</span>
          </p>
          <SimulationSocialNetworkRow
            links={links}
            onXShare={runXShare}
            xShareDisabled={sharing}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
