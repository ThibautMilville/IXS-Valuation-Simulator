# IXS Valuation Simulator

Next.js app: IXS price and valuation scenarios (TVL, MC/TVL, supply, holder stack).

```bash
npm install
npm run dev
```

Requires Node.js ≥ 20.9 (see `package.json` / `.nvmrc`).

## Environment variables

Create a `.env.local` (or configure vars in your host) when deploying.

| Variable               | Required                      | Description                                                                                                                                                  |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | **Recommended in production** | Public origin, **with** scheme and **no** trailing slash. Sets `metadataBase` and absolute `og:image` / Twitter card URLs (home + `/api/og`).                |
| —                      | **Vercel default**            | If unset, the app uses `VERCEL_URL` (`https://…vercel.app`). Set `NEXT_PUBLIC_SITE_URL` anyway when using a custom domain. Redeploy after changing env vars. |

If crawlers see `og:image` as `http://localhost:3000/...`, preview cards stay empty. That usually means the public URL was missing at deploy time; the runtime `VERCEL_URL` fallback fixes most Vercel deployments.
