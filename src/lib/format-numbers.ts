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
