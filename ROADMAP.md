# Roadmap — Marketplace Artisanat

To-do list exhaustive pour organiser le developpement. Classee par priorite :
**P0 (critique)** = bloque la confiance ou l'usage reel du site.
**P1 (important)** = attendu sur une marketplace serieuse, a faire vite.
**P2 (confort)** = ameliore nettement l'experience, pas bloquant.
**P3 (plus tard)** = pertinent seulement a plus grande echelle.

Coche `[x]` au fur et a mesure. Ajoute des notes sous un item si besoin.

---

## P0 — Critique

### Emails transactionnels
- [x] Choisir et configurer un service d'envoi (Resend recommande - gratuit jusqu'a un certain volume, bonne integration Next.js)
- [x] Email de confirmation de commande (acheteur)
- [x] Email de nouvelle vente (vendeur)
- [x] Email de nouveau message (acheteur et vendeur)
- [x] Email de confirmation/refus de candidature vendeur (admin approuve/refuse)
- [x] Email de notification de nouveau message de contact (toi, admin)
- [x] Email de bienvenue a l'inscription
  - Note (2026-07-21) : le domaine `resend.dev` par defaut bloque l'envoi a quiconque hors du compte Resend lui-meme (403 "Testing domain restriction"). Fix en cours : verifier le domaine `bonkano-solutions.fr` sur Resend puis mettre a jour `FROM_ADDRESS` dans `lib/email.ts`.

### Compte utilisateur
- [x] Mot de passe oublie / reinitialisation (page + email + token)
- [x] Verification d'email a l'inscription
- [x] Suppression de compte (droit RGPD) - au minimum une demande traitee manuellement, ideal : self-service
  - Note (2026-07-21) : self-service pour les comptes BUYER (anonymisation : nom/email remplaces, mot de passe efface, sessions/tokens supprimes ; commandes conservees anonymement pour obligations comptables). Les comptes ADMIN et les vendeurs avec une boutique active sont rediriges vers le formulaire de contact (fermeture de boutique a traiter manuellement d'abord).

### Confiance / preuve sociale
- [x] Systeme d'avis et notes (modele `Review` : note 1-5, commentaire, lie a une commande livree pour eviter les faux avis)
  - Note (2026-07-21) : eligibilite basee sur le statut de commande PAID/FULFILLED. Le workflow de suivi de livraison (P1 "Livraison / SAV") est maintenant construit, mais l'avis reste ouvert des le paiement plutot que d'attendre l'expedition - choix delibere pour ne pas trop restreindre.
- [x] Affichage note moyenne + nombre d'avis sur fiche produit et carte produit
- [x] Moderation des avis cote admin (`/admin/avis`, masquer/republier)

### Mobile
- [x] Menu mobile (hamburger) - drawer avec nav, recherche et actions de compte
- [x] Zones cliquables : icones panier/messages remontees a 44px (cible tactile) sur mobile
- [x] Audit complet du site sur mobile reel (pas seulement desktop) : header, hero, formulaires, dashboard vendeur, checkout
  - Note (2026-07-27) : teste sur un vrai telephone Android (Xiaomi Mi 9T, Chrome) via ADB (tap/swipe/text reels, pas de l'emulation). Verifie et fonctionnels : accueil (hero, header), menu hamburger (ouverture, mode sombre, fermeture), recherche, catalogue + filtres, fiche produit + galerie photo, inscription, ajout au panier, page panier, formulaire de livraison du checkout (tabulation entre champs correcte). Arrete volontairement avant "Payer maintenant" pour ne pas declencher un vrai paiement Stripe. Dashboard vendeur non teste - necessite des identifiants vendeur reels que je n'ai pas.
  - Fausse alerte importante rencontree puis ecartee : lors du test, les taps synthetiques ADB sur les boutons "fermer" (X) de la lightbox et du tiroir mobile semblaient ne rien faire (confirme via CDP : le clic JS `.click()` fonctionnait, mais le tap ADB non). L'utilisateur a confirme qu'avec un vrai doigt, la fermeture fonctionne normalement - c'etait donc un artefact de l'injection tactile ADB (qui simule le toucher differemment d'un contact capacitif reel), pas un bug du site.
  - Remarque esthetique mineure relevee (non bloquante) : dans la page panier, le titre du produit s'enroule mot par mot dans une colonne etroite a cote de la miniature - pourrait etre ameliore avec un layout empile sur mobile plutot qu'une rangee image+texte.

---

## P1 — Important

### Livraison / SAV
- [x] Champ numero de suivi + transporteur sur une commande (rempli par le vendeur, modele `Shipment` par boutique - une commande multi-boutiques passe en "Expediee" une fois que tous les vendeurs concernes ont expedie leur part)
- [x] Historique/timeline de statut de commande visible par l'acheteur (etapes Commande passee / Paiement confirme / Expediee sur la page de commande)
- [x] Workflow de demande de retour/remboursement (l'acheteur initie depuis la commande, le vendeur approuve/refuse ; l'approbation declenche un remboursement Stripe reel sur le montant de l'article)
- [x] Facture/recu telechargeable (PDF) par commande (`@react-pdf/renderer`, route `/commandes/[id]/facture`)

### Recherche / decouverte
- [x] Tri des produits (prix croissant/decroissant, plus recent, plus populaire - populaire = quantite vendue sur commandes payees)
- [x] Produits similaires / "vous aimerez aussi" sur la fiche produit (meme categorie, 4 produits)
- [x] Liste de souhaits / favoris (necessite compte) - coeur sur les cartes produit + page `/favoris`
- [x] Recherche plus tolerante aux fautes de frappe (extension `pg_trgm`, similarite sur titre/description)

### Vendeur (dashboard)
- [x] Statistiques de vente basiques (revenus sur 30j, produits les plus vendus)
- [x] Export des commandes en CSV pour la compta du vendeur (`/vendeur/commandes/export`)
- [x] Notification visuelle (badge) sur nouvelle commande, pas seulement nouveau message (badge "Commandes" = commandes payees en attente d'expedition)

### Design / UX
- [x] Galerie photo avec zoom/lightbox sur la fiche produit (miniatures cliquables + lightbox plein ecran)
- [x] Etats de chargement (skeleton) pour eviter le flash de contenu vide (produits, fiche produit, boutique, commandes, dashboard vendeur)
- [x] Page 404 personnalisee
- [x] Dark mode fonctionnel (toggle dans le header + menu mobile, persiste en localStorage, script anti-flash au chargement)
- [x] Animations de transition entre pages (fade+slide via `app/template.tsx`)

### Legal / conformite
- [x] Bandeau de consentement cookies
  - Note (2026-07-22) : le site n'utilise que des cookies strictement necessaires (session/panier), donc bandeau informatif (pas d'opt-in/opt-out, rien a "consentir") - a transformer en vrai bandeau de consentement si des cookies analytics/pub sont ajoutes un jour (voir P3 Analytics). A valider quand meme avec un professionnel du droit.
- [x] Page Politique de confidentialite dediee (`/confidentialite`) - mentions legales renvoient desormais vers elle au lieu de dupliquer le contenu

### Securite
- [x] Rate limiting sur connexion, inscription, mot de passe oublie et formulaire de contact (limiteur simple base sur Postgres par IP, pas de service externe necessaire)
- [ ] Captcha ou equivalent sur inscription si le spam devient un probleme
  - Delibrement non fait : necessite un compte chez un fournisseur (hCaptcha/Turnstile/reCAPTCHA) et des cles API que je ne peux pas provisionner moi-meme. Le rate limiting couvre deja une bonne partie du risque pour l'instant.

---

## P2 — Confort

### Paiement
- [ ] Stripe Connect (reversement automatique aux vendeurs) - gros chantier, a faire quand le nombre de vendeurs justifie de ne plus reverser manuellement
- [ ] Activer Apple Pay / Google Pay sur Stripe Checkout
  - Note (2026-07-22) : Stripe Checkout gere Apple Pay/Google Pay automatiquement des lors qu'un domaine est verifie - c'est un reglage a faire toi-meme dans le Dashboard Stripe (Settings > Payment methods, + verification de domaine pour Apple Pay), pas du code. Rien a developper cote appli.
- [x] Codes promo / reductions - modele `PromoCode` (pourcentage ou montant fixe), applique au checkout via un coupon Stripe cree a la volee, gestion admin sur `/admin/promos`

### Admin
- [x] Graphiques sur le tableau de bord admin (evolution des ventes, inscriptions sur 30 jours - graphiques SVG maison avec survol, palette basee sur les tokens chart-1/chart-2 existants)
- [x] Gestion des remboursements Stripe directement depuis l'admin (`/admin/commandes`, remboursement integral)
- [x] Log d'activite / audit trail des actions admin (`/admin/audit`) - couvre boutiques (approuver/suspendre), produits (depublier/supprimer), utilisateurs (promouvoir/retrograder), avis (masquer/republier), codes promo (creer/activer/desactiver), remboursements

### Contenu
- [x] Vrai contenu blog (actuellement page "bientot disponible")
  - Note (2026-07-23) : systeme de blog leger base sur des fichiers (`lib/blog.ts` + composants par article, pas de modele DB - pas necessaire pour une poignee d'articles geres a la main). Trois articles publies : "Pourquoi une marketplace sans intermediaire" (demarche/marque, s'appuie sur les faits deja confirmes de `/notre-histoire`), "Bien entretenir vos bijoux en bronze, en argent et vos ceramiques" (conseils generaux, aucune information specifique inventee), et un portrait de l'artisan Hamada Soulimane volontairement court - seuls les faits confirmes (nom, metier, lieu au musee national du Niger a Niamey) y figurent ; a completer avec parcours/technique/photos une fois disponibles.
- [ ] Photos presentables pour les bijoux en argent (dossier en attente, evoque en session precedente)
- [ ] Elargir le catalogue / recruter plus d'artisans partenaires

### SEO / performance avance
- [x] Donnees structurees JSON-LD (schema.org `Organization` sur tout le site, `Product` + `AggregateRating` sur la fiche produit)
- [ ] Audit Lighthouse (performance, accessibilite, SEO) et corriger les points faibles
  - Non fait cette session : necessite un vrai run Chrome DevTools/PageSpeed Insights avec arbitrage humain sur les compromis - a faire toi-meme sur https://pagespeed.web.dev avec l'URL de prod, ou via l'onglet Lighthouse de Chrome DevTools.
- [x] Verifier la taille/le format des images produits - deja gere automatiquement par `next/image` (AVIF/WebP negocies selon le navigateur, tailles responsives via l'attribut `sizes` deja utilise partout)

### Accessibilite
- [x] Audit contraste couleurs (WCAG AA minimum)
  - Note (2026-07-22) : audit via agent dedie (calcul oklch -> luminance relative). Un seul echec confirme corrige : le focus des options de `Select` (`focus:bg-accent focus:text-accent-foreground`, 3.45:1) - remplace par `bg-accent/15 text-foreground`. Le reste des paires (light + dark) passe AA. Quelques paires necessitent une verification manuelle avec un vrai outil de contraste (bordures a opacite variable) - non bloquant.
- [x] Navigation clavier complete (tab, focus visible partout)
  - Note (2026-07-22) : les etoiles de notation (`review-form.tsx`) n'avaient pas l'anneau de focus standard - corrige. Les dialogues (Sheet, lightbox) reposent sur Base UI qui gere deja le piege de focus/Echap correctement.
- [x] Attributs ARIA sur les composants interactifs (menus, modales, formulaires)
  - Note (2026-07-22) : logo du header sans nom accessible sur mobile (span cache) - corrige avec aria-label. Etoiles de notation sans etat expose (aria-pressed) ni resume pour lecteur d'ecran (aria-label sur le composant d'affichage) - corrige. Messages de succes/erreur du formulaire d'avis sans aria-live/role=alert - corrige. Lightbox sans titre accessible (Dialog.Title) - corrige. Points de pagination de la lightbox avec une cible tactile de 8px (sous le minimum WCAG 2.2 de 24px) - agrandis a 24px tout en gardant le point visuel a 8px.

---

## P3 — Plus tard / a plus grande echelle

- [x] Tests automatises (unitaires + end-to-end) - fragile sans, mais gros investissement initial
  - Note (2026-07-23) : `npm run test` (Vitest) - 55 tests unitaires sur tous les schemas zod de `lib/validations/` + `lib/blog.ts` + `lib/utils.ts`, aucune base de donnees necessaire, tous passent. `npm run test:e2e` (Playwright) - suite complete (pages publiques + 404, inscription/connexion, catalogue/recherche/panier) qui tourne contre un Postgres local jetable (`docker compose up -d db-test`, jamais contre la prod), seede via `prisma/seed-test.ts`. Pas encore executee dans cette session : Docker Desktop n'etait pas lance sur la machine - a lancer toi-meme puis `npm run db:test:migrate && npm run db:test:seed && npm run test:e2e`.
- [ ] Monitoring d'erreurs en production (Sentry ou equivalent)
- [ ] Analytics (Plausible ou Google Analytics) pour suivre trafic/conversion
- [x] CI/CD avec verifications avant deploiement (actuellement deploiement direct sans etape de validation automatique)
  - Note (2026-07-27) : `.github/workflows/ci.yml`, deux jobs sur chaque push/PR vers master. `verify` (rapide, sans service) : lint + `tsc --noEmit` + tests unitaires Vitest. `build-and-e2e` (apres succes de `verify`) : Postgres jetable en service, `prisma migrate deploy` contre cette base (valide que les migrations s'appliquent proprement avant qu'elles n'atteignent la vraie base), `next build` complet, puis la suite Playwright entiere contre l'app demarree. Verifie en conditions reelles sur GitHub Actions - deux allers-retours necessaires pour corriger `DATABASE_URL` manquant sur le job `verify` (requis par `prisma generate`) et `AUTH_TRUST_HOST` manquant pour Auth.js en mode production (`next start` refusait `localhost` comme hote de confiance). Mise a jour (2026-07-27) : un 3e job `deploy` a ete ajoute, qui deploie automatiquement en production via la CLI Vercel (avec nouvelles tentatives sur le verrou Postgres) une fois `verify` et `build-and-e2e` verts, uniquement sur un push direct sur `master`. Le deploiement manuel (`vercel --prod`) n'est donc plus necessaire.
  - A egalement corrige au passage plusieurs erreurs de lint preexistantes (non liees a ce chantier) pour que `npm run lint` puisse devenir un vrai gate : `ThemeToggle` et `CookieBanner` utilisaient un `setState` synchrone dans un `useEffect` pour lire un etat navigateur (classe `dark`, `localStorage`) - remplace par `useSyncExternalStore`, le pattern React recommande pour ce cas (SSR-safe, pas de rendu supplementaire).
- [ ] Sauvegardes base de donnees automatisees et testees (verifier ce que Neon fait deja nativement)
- [ ] Connexion via Google/autre fournisseur OAuth (confort, pas critique)
- [x] 2FA sur les comptes vendeur/admin
  - Note (2026-07-27) : TOTP standard (RFC 6238) via `otpauth` + QR code local (`qrcode`) - aucun service externe. Activation depuis `/compte` (carte visible uniquement pour SELLER/ADMIN) : generation du secret + QR -> confirmation par code -> 10 codes de secours a usage unique (hashes bcrypt) affiches une seule fois. `signInAction` verifie le mot de passe d'abord ; si le compte a la 2FA active et qu'aucun code n'est fourni, il renvoie `requiresTwoFactor` et le formulaire de connexion revele un champ code (accepte code TOTP ou code de secours) sans redemander email/mot de passe. Couvert par 9 tests unitaires + un test e2e complet (activer, se deconnecter, se reconnecter avec un code TOTP genere, desactiver) - verifie a la fois en local (Docker) et sur les runners GitHub Actions.
  - Egalement ajoute au passage : `CI/CD` deploie desormais automatiquement en production apres succes de `verify` + `build-and-e2e` (job `deploy` dans `.github/workflows/ci.yml`, avec nouvelles tentatives automatiques sur le verrou Postgres transitoire) - le deploiement manuel (`vercel --prod`) n'est plus necessaire a chaque push sur `master`.
- [ ] Multi-langue / multi-devise (pas pertinent tant que le marche cible reste la France/zone euro)
- [ ] Application mobile native (tres long terme, seulement si le trafic mobile web le justifie)

---

## Notes de suivi

- Bug corrige (2026-07-22) : la page `/admin` plantait en production ("A server error occurred") depuis l'ajout des graphiques du tableau de bord admin. Cause : `LineChart` recevait un prop `valueFormatter` (fonction) depuis le composant serveur `app/(admin)/admin/page.tsx` - React Server Components ne peut pas serialiser une fonction a travers la frontiere serveur/client. Corrige en remplacant par un prop `unit: "eur" | "count"`, formate cote client.

- Les emails transactionnels et les avis sont probablement les deux items qui debloquent le plus de valeur d'un coup — a discuter en premier pour l'ordre de developpement.
- Le webhook auto-deploy GitHub -> Vercel a deja saute une fois sans raison connue (voir session du 2026-07-21) — a surveiller, potentiellement a reconfigurer.
- Le bug d'image cassee sur le produit "Vase en gres emaille" (boutique Fil et Terre) releve le 2026-07-20 concerne une donnee de test qui ne restera pas - pas corrige a la source. En revanche (2026-07-27), le cas general a ete traite : toute image produit dont l'URL echoue au chargement affiche desormais un placeholder discret (icone) au lieu de l'icone d'image cassee du navigateur, sur les cartes produit, la galerie fiche produit, le panier, la liste des artisans et le gestionnaire de photos vendeur (`components/ui/product-image.tsx`).
