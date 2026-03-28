# IXS Valuation Simulator

Application **Next.js** pour simuler le prix et la valorisation du token IXS (TVL, ratio MC/TVL, offre, stack détenteur).

## Prérequis

- **Node.js** ≥ 20.9 (voir `package.json` et `.nvmrc`)

## Démarrage

```bash
npm install
npm run dev
```

Autres scripts : `npm run build`, `npm run start`, `npm run lint`.

## Variables d’environnement

À définir dans `.env.local` ou dans l’interface de ton hébergeur (puis **redéployer** si tu changes une variable).

| Variable | Obligatoire | Rôle |
| -------- | ----------- | ---- |
| `NEXT_PUBLIC_SITE_URL` | Recommandé en prod | URL publique du site, **avec** le schéma (`https://`) et **sans** slash final. Sert de repli dans `getPublicSiteUrl()` quand la requête n’a pas d’en-têtes `Host` / `X-Forwarded-Host` exploitables (build, certains jobs). |

Si la variable est absente sur **Vercel**, le code utilise en secours `VERCEL_URL` pour fabriquer une base `https://…`. En local sans rien configurer, le repli par défaut est `http://localhost:3000`.

## Aperçus de lien (Open Graph, X, etc.)

- **Image par défaut** : fichier statique `public/og-default.png`. Les balises `og:image` et `twitter:image` sont définies dans `src/app/layout.tsx` (`generateMetadata`) avec une URL absolue `{origine}/og-default.png`, l’origine étant dérivée des en-têtes de la requête quand c’est possible.
- **Image dynamique (partage avec paramètres d’URL)** : route `GET /api/og` (réécriture `GET /og.png` → `/api/og` dans `next.config.ts`). Sert à générer une carte PNG pour les URLs qui incluent l’état de partage dans la query.
- **`/robots.txt`** : généré par `src/app/robots.ts` (accès autorisé à tout le site pour les robots).

Si les cartes de prévisualisation pointent encore vers `http://localhost:3000`, configure `NEXT_PUBLIC_SITE_URL` sur l’URL de production ou vérifie que ton hébergeur envoie bien `Host` / `X-Forwarded-Host`.

## Partage depuis l’app

Le modal « Share » propose le **texte** de la simulation et des **liens** vers les réseaux (intent X, etc.). Il n’y a **pas** de génération d’image côté navigateur pour joindre un fichier au tweet : l’image des cartes sociales repose sur les métadonnées et les routes ci-dessus.
