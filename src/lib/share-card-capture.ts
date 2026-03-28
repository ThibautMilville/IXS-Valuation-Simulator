import { toBlob } from "html-to-image";

async function waitForPaint(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function captureFilter(node: HTMLElement): boolean {
  if (node.getAttribute("data-share-capture-skip") !== null) {
    return false;
  }
  return true;
}

export async function captureShareCardAsPngFile(
  node: HTMLElement,
  filename = "ixs-simulation.png",
): Promise<File | null> {
  try {
    if (typeof document !== "undefined" && document.fonts?.ready) {
      await document.fonts.ready;
    }
    await waitForPaint();
    const blob = await toBlob(node, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#0b0b0f",
      filter: captureFilter,
    });
    if (!blob) {
      return null;
    }
    return new File([blob], filename, { type: "image/png" });
  } catch {
    return null;
  }
}

function canTryShare(data: ShareData): boolean {
  if (typeof navigator.canShare !== "function") {
    return true;
  }
  try {
    return navigator.canShare(data);
  } catch {
    return false;
  }
}

async function shareWithAttempts(attempts: ShareData[]): Promise<boolean> {
  if (typeof navigator.share !== "function") {
    return false;
  }
  for (const data of attempts) {
    if (!canTryShare(data)) {
      continue;
    }
    try {
      await navigator.share(data);
      return true;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        return true;
      }
    }
  }
  return false;
}

export async function shareSimulationWithOptionalImage(
  cardEl: HTMLElement,
  opts: { title: string; text: string; url: string },
): Promise<void> {
  const file = await captureShareCardAsPngFile(cardEl);
  if (file) {
    const withImage: ShareData[] = [
      { title: opts.title, text: opts.text, files: [file] },
      { title: opts.title, files: [file] },
      { files: [file] },
    ];
    if (await shareWithAttempts(withImage)) {
      return;
    }
  }
  if (typeof navigator.share !== "function") {
    return;
  }
  const plain: ShareData = {
    title: opts.title,
    text: opts.text,
  };
  if (opts.url) {
    plain.url = opts.url;
  }
  try {
    await navigator.share(plain);
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return;
    }
  }
}

export async function shareSimulationOnX(
  cardEl: HTMLElement,
  opts: {
    title: string;
    tweetCaption: string;
    siteUrl: string;
    intentUrl: string;
  },
): Promise<void> {
  const caption = opts.tweetCaption.includes(opts.siteUrl)
    ? opts.tweetCaption
    : `${opts.tweetCaption}\n\n${opts.siteUrl}`;
  const file = await captureShareCardAsPngFile(cardEl);
  if (file) {
    const withImage: ShareData[] = [
      { title: opts.title, text: caption, files: [file] },
      { text: caption, files: [file] },
      { files: [file] },
    ];
    if (await shareWithAttempts(withImage)) {
      return;
    }
  }
  if (typeof globalThis.window !== "undefined") {
    globalThis.window.open(opts.intentUrl, "_blank", "noopener,noreferrer");
  }
}
