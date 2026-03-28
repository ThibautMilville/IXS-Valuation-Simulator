export function searchParamsRecordToURLSearchParams(
  raw: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(raw)) {
    if (v === undefined) {
      continue;
    }
    sp.set(k, Array.isArray(v) ? (v[0] ?? "") : v);
  }
  return sp;
}
