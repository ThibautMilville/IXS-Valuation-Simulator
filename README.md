# IXS Valuation Simulator

Next.js app: IXS price and valuation scenarios (TVL, MC/TVL, supply, holder stack).

```bash
npm install
npm run dev
```

Requires Node.js ≥ 20.9 (see `package.json` / `.nvmrc`).

## Environment variables

Create a `.env.local` (or configure vars in your host) when deploying.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | **Recommended in production** | Public origin of the site, **with** scheme and **no** trailing slash, e.g. `https://your-domain.com`. Used as Next.js `metadataBase` so Open Graph and Twitter preview images resolve to absolute URLs for shared `/share?…` links. If unset, it defaults to `http://localhost:3000` (fine for local dev only). |

Without a correct `NEXT_PUBLIC_SITE_URL` in production, social crawlers may not show the preview card image for shared simulation links.