import type { Metadata } from "next";
import Link from "next/link";
import { searchParamsRecordToURLSearchParams } from "@/lib/search-params-record";
import {
  encodeShareUrlQuery,
  parseShareUrlQuery,
} from "@/lib/share-url-state";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const raw = await searchParams;
  const sp = searchParamsRecordToURLSearchParams(raw);
  const state = parseShareUrlQuery(sp);
  const qs = state ? encodeShareUrlQuery(state) : "";
  const imagePath = qs ? `/api/og?${qs}` : "/api/og";

  return {
    title: "IXS Valuation Simulator · Share",
    openGraph: {
      title: "IXS Valuation Simulator",
      description: "Simulation snapshot",
      type: "website",
      images: [{ url: imagePath, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "IXS Valuation Simulator",
      images: [imagePath],
    },
  };
}

export default async function SharePage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const sp = searchParamsRecordToURLSearchParams(raw);
  const state = parseShareUrlQuery(sp);
  const homeHref = state ? `/?${encodeShareUrlQuery(state)}` : "/";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold text-white">
        IXS Valuation Simulator
      </h1>
      <p className="max-w-md text-sm text-zinc-400">
        Open this scenario in the simulator.
      </p>
      <Link
        href={homeHref}
        className="rounded-xl bg-[#2564dd] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1f56c4]"
      >
        Open simulator
      </Link>
    </div>
  );
}
