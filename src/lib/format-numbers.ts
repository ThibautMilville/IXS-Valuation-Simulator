const GROUP = /\B(?=(\d{3})+(?!\d))/g;

function addCommas(intStr: string): string {
  const neg = intStr.startsWith("-");
  const core = neg ? intStr.slice(1) : intStr;
  const g = core.replace(GROUP, ",");
  return neg ? `-${g}` : g;
}

function trimTrailingZeros(dec: string): string {
  return dec.replace(/0+$/, "").replace(/\.$/, "");
}

export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) {
    return "$0";
  }
  const rounded = Math.round(value * 100) / 100;
  const sign = rounded < 0 ? "-" : "";
  const a = Math.abs(rounded);
  const fixed = a.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const dec = trimTrailingZeros(decPart);
  const body = dec ? `${addCommas(intPart)}.${dec}` : addCommas(intPart);
  return `${sign}$${body}`;
}

export function formatUsdPrice(value: number): string {
  if (!Number.isFinite(value)) {
    return "$0.000";
  }
  const rounded = Math.round(value * 1000) / 1000;
  const sign = rounded < 0 ? "-" : "";
  const a = Math.abs(rounded);
  const fixed = a.toFixed(3);
  const [intPart, decPart] = fixed.split(".");
  const body = `${addCommas(intPart)}.${decPart}`;
  return `${sign}$${body}`;
}

function compactMultiplier(n: number): string {
  const r = Math.round(n * 100) / 100;
  if (Number.isInteger(r)) {
    return String(r);
  }
  return r.toFixed(2).replace(/\.?0+$/, "");
}

export function formatUsdCompact(value: number): string {
  if (!Number.isFinite(value)) {
    return "$0";
  }
  const sign = value < 0 ? "-" : "";
  const v = Math.abs(value);
  if (v >= 1e12) {
    return `${sign}$${compactMultiplier(v / 1e12)}T`;
  }
  if (v >= 1e9) {
    return `${sign}$${compactMultiplier(v / 1e9)}B`;
  }
  if (v >= 1e6) {
    return `${sign}$${compactMultiplier(v / 1e6)}M`;
  }
  if (v >= 1e3) {
    return `${sign}$${compactMultiplier(v / 1e3)}K`;
  }
  return `${sign}${formatUsd(v)}`;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }
  const rounded = Math.round(value * 100) / 100;
  const sign = rounded < 0 ? "-" : "";
  const a = Math.abs(rounded);
  const fixed = a.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const dec = trimTrailingZeros(decPart);
  const body = dec ? `${addCommas(intPart)}.${dec}` : addCommas(intPart);
  return `${sign}${body}`;
}

export function formatInteger(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }
  return addCommas(String(Math.round(value)));
}

export function formatPercent(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  const d = Math.min(2, Math.max(0, fractionDigits));
  const m = 10 ** d;
  const r = Math.round(value * m) / m;
  const s = r.toFixed(d).replace(/\.?0+$/, "");
  return `${s}%`;
}

export function formatInputEditMode(value: number, integerOnly: boolean): string {
  if (!Number.isFinite(value)) {
    return "";
  }
  if (integerOnly) {
    return String(Math.round(value));
  }
  const r = Math.round(value * 100) / 100;
  if (Number.isInteger(r)) {
    return String(r);
  }
  return r.toFixed(2).replace(/\.?0+$/, "");
}

export function formatInputBlurred(value: number, integerOnly: boolean): string {
  if (integerOnly) {
    return formatInteger(value);
  }
  return formatNumber(value);
}

const WIDTH_ESTIMATE_CAP_INTEGER = Number.MAX_SAFE_INTEGER;
const WIDTH_ESTIMATE_CAP_DECIMAL = 1e15;

export function estimateBlurredInputChars(
  n: number,
  integerOnly: boolean,
): number {
  if (!Number.isFinite(n)) {
    return 1;
  }
  const cap = integerOnly ? WIDTH_ESTIMATE_CAP_INTEGER : WIDTH_ESTIMATE_CAP_DECIMAL;
  const clamped = Math.min(Math.max(n, -cap), cap);
  return formatInputBlurred(clamped, integerOnly).length;
}

function maxIntegerBlurredLenBetween(ai: number, bi: number): number {
  const span = bi - ai;
  let m = Math.max(
    formatInputBlurred(ai, true).length,
    formatInputBlurred(bi, true).length,
  );
  const samples = 400;
  for (let i = 0; i <= samples; i++) {
    const v = ai + Math.round((span * i) / samples);
    m = Math.max(m, formatInputBlurred(v, true).length);
  }
  for (let e = 1; e <= 18; e++) {
    const below = 10 ** e - 1;
    if (below >= ai && below <= bi) {
      m = Math.max(m, formatInputBlurred(below, true).length);
    }
    const at = 10 ** e;
    if (at >= ai && at <= bi) {
      m = Math.max(m, formatInputBlurred(at, true).length);
    }
  }
  return m;
}

function maxDecimalBlurredLenBetween(cl: number, ch: number): number {
  let m = Math.max(
    formatInputBlurred(cl, false).length,
    formatInputBlurred(ch, false).length,
  );
  const steps = 300;
  for (let i = 0; i <= steps; i++) {
    const t = cl + ((ch - cl) * i) / steps;
    const r = Math.round(t * 100) / 100;
    const v = Math.min(ch, Math.max(cl, r));
    m = Math.max(m, formatInputBlurred(v, false).length);
  }
  return m;
}

export function maxInputDisplayLenInRange(
  lo: number,
  hi: number,
  integerOnly: boolean,
): number {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
    return 1;
  }
  if (integerOnly) {
    const ai = Math.floor(
      Math.max(Math.min(lo, hi), -WIDTH_ESTIMATE_CAP_INTEGER),
    );
    const bi = Math.floor(
      Math.min(Math.max(lo, hi), WIDTH_ESTIMATE_CAP_INTEGER),
    );
    return maxIntegerBlurredLenBetween(ai, bi);
  }
  const cl = Math.max(Math.min(lo, hi), -WIDTH_ESTIMATE_CAP_DECIMAL);
  const ch = Math.min(Math.max(lo, hi), WIDTH_ESTIMATE_CAP_DECIMAL);
  return maxDecimalBlurredLenBetween(cl, ch);
}
