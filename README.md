# Xam Xam

Bibliothèque numérique de Serigne Touba Cheikh Ahmadou Bamba : livres (PDF)
filtrables en wolof / français / arabe, playlists audio, vidéos et wirds.
Application Next.js autonome (aucun lien avec un autre projet).

## Stack technique

- [Next.js 16](https://nextjs.org) (App Router, Server Actions, Turbopack)
- [Prisma](https://www.prisma.io) + PostgreSQL (Neon)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev) pour les animations
- PWA installable (manifest, service worker, icônes propres à `/xamxam`)
- Authentification admin maison (cookie signé HMAC, sans dépendance externe)

## Démarrage

```bash
npm install
cp .env.example .env      # renseignez DATABASE_URL/DATABASE_URL_UNPOOLED (Neon) et un AUTH_SECRET
npx prisma migrate dev --name init   # applique le schéma sur la base Postgres
npm run db:seed           # crée l'administrateur + des données de démonstration
npm run generate-icons    # (optionnel, déjà fait) régénère les icônes PWA
npm run dev
```

Générer un secret pour `AUTH_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Ouvrez [http://localhost:3000/xamxam](http://localhost:3000/xamxam)
(la racine `/` redirige automatiquement vers `/xamxam`).

## Compte administrateur de démonstration

Après `npm run db:seed` :

- URL : `/xamxam/admin/login`
- E-mail : `admin@xamxam.sn`
- Mot de passe : `XamXam2026!`

Pensez à changer ce mot de passe (ou recréer l'admin) avant toute mise en
production.

## Contenu

Tous les fichiers (PDF, audio, vidéo) sont hébergés à l'extérieur (Google
Drive, YouTube, etc.) : seul leur lien est stocké en base. L'espace admin
(`/xamxam/admin`) permet d'ajouter/modifier/supprimer :

- **Livres** (Xam Xam) — titre, auteur, langue, thématique, lien PDF
- **Playlists** — titre + pistes audio (lien, récitant, durée)
- **Vidéos** — lien YouTube ou fichier direct
- **Wirds** — texte (avec rendu RTL pour l'arabe), moment de récitation, audio

## Structure

```
prisma/schema.prisma       Modèles (XamXamBook, Playlist, Track, Video, Wird, Admin)
prisma/seed-xamxam.ts       Données de démonstration + compte admin
src/proxy.ts                 Protection de /xamxam/admin par cookie signé
src/lib/xamxam/session.ts    Signature/vérification du cookie de session admin
src/lib/xamxam/auth.ts       Lecture de l'admin connecté (server-only)
src/lib/xamxam/labels.ts     Libellés de langue, extraction d'ID YouTube, etc.
src/app/xamxam/layout.tsx    Thème (vert/or), polices, PWA, service worker
src/app/xamxam/(site)/…      Pages publiques : accueil, livres, playlists, vidéos, wirds
src/app/xamxam/admin/…       Connexion admin + tableau de bord + CRUD
src/components/xamxam/…      Composants UI (cartes, lecteur audio, filtres, animations)
public/xamxam-manifest.webmanifest, public/xamxam-sw.js, public/xamxam-icons/  PWA
```

## Notes de migration

Ce dossier a été extrait d'un monorepo où Xam Xam cohabitait avec une autre
application. Tout ce qui est fourni ici est autonome et prêt à l'emploi :
aucune référence à l'autre projet ne subsiste (pas de NextAuth, pas de
modèles ou de routes partagés). Si vous repartez d'un projet Next.js déjà
existant plutôt que de ce scaffold, il suffit de copier :

1. `src/app/xamxam/`, `src/components/xamxam/`, `src/lib/xamxam/`
2. Le contenu de `prisma/schema.prisma` (modèles `XamXam*`) dans votre schéma
3. `prisma/seed-xamxam.ts` et le script npm `db:seed`
4. `public/xamxam-*`
5. La logique de `src/proxy.ts` (à fusionner avec votre proxy existant s'il y
   en a déjà un)
6. Les dépendances `framer-motion`, `bcryptjs`, `zod`, `@prisma/client` /
   `prisma`
