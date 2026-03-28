type StatCardProps = {
  label: string;
  value: string;
  sublabel?: string;
  emphasize?: boolean;
};

export function StatCard({
  label,
  value,
  sublabel,
  emphasize,
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border px-4 py-4 backdrop-blur-md transition-colors duration-300 ${
        emphasize
          ? "border-[#2564dd]/30 bg-gradient-to-br from-[#2564dd]/12 via-zinc-900/50 to-zinc-950/80 ring-1 ring-[#2564dd]/20"
          : "border-white/[0.06] bg-zinc-900/35 ring-1 ring-white/[0.03]"
      }`}
    >
      {emphasize ? (
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#2564dd]/25 blur-2xl"
          aria-hidden
        />
      ) : null}
      <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>
      <p
        className={`relative mt-2 font-mono text-xl font-medium tabular-nums tracking-tight sm:text-2xl ${
          emphasize ? "text-[#7eb3ff]" : "text-zinc-100"
        }`}
      >
        {value}
      </p>
      {sublabel ? (
        <p className="relative mt-1.5 text-xs text-zinc-500">{sublabel}</p>
      ) : null}
    </div>
  );
}
