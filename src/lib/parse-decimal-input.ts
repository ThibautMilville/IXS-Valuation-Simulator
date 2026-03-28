export function parseDecimalInput(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, "").replace(/,/g, "");
  if (t === "") {
    return null;
  }
  const n = Number(t);
  if (!Number.isFinite(n)) {
    return null;
  }
  return n;
}
