# IXS Valuation Simulator

**Next.js** app for IXS price and valuation scenarios (TVL, MC/TVL ratio, supply, holder stack).

## Requirements

- **Node.js** ≥ 20.9 (see `package.json` and `.nvmrc`)

## Getting started

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Environment variables

Set these in `.env.local` or your host’s dashboard. **Redeploy** after changing values in production.

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `NEXT_PUBLIC_SITE_URL` | Recommended in production | Public site URL **with** scheme (`https://`) and **no** trailing slash. Used as a fallback in `getPublicSiteUrl()` when the request has no usable `Host` / `X-Forwarded-Host` headers (e.g. some builds or jobs). |

On **Vercel**, if unset, the app falls back to `VERCEL_URL` and builds a `https://…` base. Locally, with nothing configured, the default is `http://localhost:3000`.

## Link previews (Open Graph, X, etc.)

- **Default image**: static file `public/og-default.png`. `og:image` and `twitter:image` are set in `src/app/layout.tsx` (`generateMetadata`) as an absolute `{origin}/og-default.png`, with `origin` taken from request headers when possible.
- **Dynamic image (share URLs with query params)**: `GET /api/og`, also reachable via the rewrite `GET /og.png` → `/api/og` in `next.config.ts`. Renders a PNG card for URLs that encode share state in the query string.
- **`/robots.txt`**: served from `src/app/robots.ts` (allows all crawlers site-wide).

If preview cards still show `http://localhost:3000`, set `NEXT_PUBLIC_SITE_URL` to your production origin or ensure your host sends correct `Host` / `X-Forwarded-Host` headers.

## In-app sharing

The Share modal exposes **plain text** for the simulation and **links** to social intents (X, etc.). There is **no** client-side image capture for attaching a file to a tweet; social card images come from the metadata and routes above.
