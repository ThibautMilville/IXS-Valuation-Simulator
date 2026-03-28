# IXS Valuation Simulator

Next.js app: IXS price and valuation scenarios (TVL, MC/TVL, supply, holder stack).

```bash
npm install
npm run dev
```

Requires Node.js ≥ 20.9 (see `package.json` / `.nvmrc`).

## Environment variables

Create a `.env.local` (or configure vars in your host) when deploying.

| Variable               | Required                      | Description                                                                                                                                 |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | **Recommended in production** | Public origin, **with** scheme and **no** trailing slash. Used as fallback for `metadataBase` when request headers do not expose a public host. |
| —                      | **Vercel default**            | If unset, the app can still resolve the site URL from the incoming request. Set `NEXT_PUBLIC_SITE_URL` when using a custom domain. Redeploy after changing env vars. |

### Link previews (Open Graph)

Default preview image: static file `public/og-default.png`, referenced in `layout` metadata. Dynamic share images for URLs with query parameters are served by `GET /api/og` (rewritten from `/og.png` in `next.config.ts`).

If crawlers show `og:image` pointing at `http://localhost:...`, set `NEXT_PUBLIC_SITE_URL` to your production origin or rely on correct host headers on your host.
