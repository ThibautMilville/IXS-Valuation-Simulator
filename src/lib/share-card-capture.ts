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

export async function shareSimulationWithOptionalImage(
  cardEl: HTMLElement,
  opts: { title: string; text: string; url: string },
): Promise<void> {
  if (typeof navigator.share !== "function") {
    return;
  }
  const file = await captureShareCardAsPngFile(cardEl);
  if (
    file &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        title: opts.title,
        files: [file],
      });
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        return;
      }
    }
    try {
      await navigator.share({
        files: [file],
      });
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        return;
      }
    }
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
