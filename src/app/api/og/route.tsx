import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OgIxsLogo } from "@/components/og/OgIxsLogo";
import { OgSimulationCard } from "@/components/og/OgSimulationCard";
import type { IxsSimulatorResult } from "@/lib/ixs-simulator";
import { type ShareUrlState, parseShareUrlQuery, simulationFromShareState } from "@/lib/share-url-state";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ogCacheHeaders = {
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
};

function buildOgResponse(state: ShareUrlState, result: IxsSimulatorResult) {
  return new ImageResponse(<OgSimulationCard result={result} state={state} />, { width: 1200, height: 630, headers: ogCacheHeaders });
}

function ogFallback() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "linear-gradient(180deg, #12121a 0%, #0b0b0f 50%, #08080c 100%)",
        color: "#fafafa",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "rgba(37, 100, 221, 0.35)",
      }}>
      <OgIxsLogo width={280} />
      <div
        style={{
          marginTop: 24,
          fontSize: 22,
          fontWeight: 600,
          color: "#93b4f0",
          textTransform: "uppercase",
          letterSpacing: 3,
        }}>
        Valuation simulator
      </div>
    </div>,
    { width: 1200, height: 630, headers: ogCacheHeaders },
  );
}

export async function GET(request: NextRequest) {
  const reqUrl = request.url;
  const ua = request.headers.get("user-agent") ?? "";

  try {
    const { searchParams } = new URL(reqUrl);
    const state = parseShareUrlQuery(searchParams);
    if (!state) {
      console.log("[ixs:og]", {
        variant: "fallback",
        reason: "no_or_invalid_query",
        requestUrl: reqUrl,
        userAgentPreview: ua.slice(0, 120),
      });
      return ogFallback();
    }
    const result = simulationFromShareState(state);
    if (!result) {
      console.log("[ixs:og]", {
        variant: "fallback",
        reason: "simulation_null",
        requestUrl: reqUrl,
        userAgentPreview: ua.slice(0, 120),
      });
      return ogFallback();
    }
    console.log("[ixs:og]", {
      variant: "simulation_card",
      requestUrl: reqUrl,
      userAgentPreview: ua.slice(0, 120),
    });
    return buildOgResponse(state, result);
  } catch (err) {
    console.error("[ixs:og]", {
      variant: "fallback",
      reason: "exception",
      requestUrl: reqUrl,
      message: err instanceof Error ? err.message : String(err),
      userAgentPreview: ua.slice(0, 120),
    });
    return ogFallback();
  }
}
