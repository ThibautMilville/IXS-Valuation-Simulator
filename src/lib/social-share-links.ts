export function buildFacebookShareUrl(pageUrl: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
}

export function buildLinkedInShareUrl(pageUrl: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
}

export function buildRedditSubmitUrl(pageUrl: string, title: string): string {
  const p = new URLSearchParams();
  p.set("url", pageUrl);
  p.set("title", title);
  return `https://www.reddit.com/submit?${p.toString()}`;
}

export function buildTelegramShareUrl(text: string, pageUrl: string): string {
  const p = new URLSearchParams();
  p.set("url", pageUrl);
  p.set("text", text);
  return `https://t.me/share/url?${p.toString()}`;
}

export function buildWhatsAppShareUrl(text: string, pageUrl: string): string {
  const combined = pageUrl ? `${text}\n${pageUrl}` : text;
  return `https://wa.me/?text=${encodeURIComponent(combined)}`;
}
