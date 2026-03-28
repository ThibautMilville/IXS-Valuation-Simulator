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
  try {
    const { searchParams } = new URL(request.url);
    const state = parseShareUrlQuery(searchParams);
    if (!state) {
      return ogFallback();
    }
    const result = simulationFromShareState(state);
    if (!result) {
      return ogFallback();
    }
    return buildOgResponse(state, result);
  } catch {
    return ogFallback();
  }
}
