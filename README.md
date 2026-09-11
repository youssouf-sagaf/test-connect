# TestConnect

Plateforme B2B2C de tests produits — React + Vite + Tailwind + Supabase.

## Démarrage local

```bash
cd app
cp .env.example .env   # renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

## Base de données Supabase

1. Ouvrir le [SQL Editor](https://supabase.com/dashboard/project/ghgyvtnigdvegcfdjfzv/sql) du projet.
2. Exécuter le fichier `supabase/migrations/001_initial_schema.sql`.
3. Dans **Authentication → Providers**, désactiver la confirmation email pour les tests (optionnel).
4. Créer un compte admin manuellement :
   - S'inscrire via l'app (ou Auth dashboard).
   - Exécuter : `UPDATE profiles SET role = 'admin', status = 'active' WHERE email = 'votre@email.com';`

## Build production

```bash
cd app && npm run build
```

Le dossier `app/dist` contient les fichiers statiques.

## Déploiement (Vercel)

```bash
cd app
npx vercel --prod
```

Variables d'environnement à configurer sur Vercel :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Fonctionnalités

- Pages publiques (accueil, tarifs, FAQ, légal)
- Inscription / connexion entreprise et testeur
- Dashboard entreprise + création de campagne (4 étapes)
- Espace testeur (missions, feedback, gains)
- Dashboard admin (validation feedbacks, campagnes, paiements simulés)
- Logo officiel, design system violet-rose
