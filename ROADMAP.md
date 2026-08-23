# Roadmap — Façonné

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
- [x] Frais de livraison + delai indicatif affiches sur la fiche produit
  - Note (2026-08-05) : identifie comme le vrai point de friction avant achat lors d'un audit du site (aucune information de livraison au-dela d'un badge marketing generique identique partout). Champs `shippingPriceCents`/`shippingInfo` ajoutes sur `Shop` (livraison geree par vendeur, pas par produit - coherent avec le modele existant ou chaque artisan gere sa propre expedition), renseignables depuis `/vendeur/boutique`. Facultatifs : si non renseignes, la fiche produit garde le message generique plutot que d'afficher "0 €" ou un champ vide. Migration Prisma generee puis nettoyee a la main - l'outil de diff proposait aussi de supprimer les index `pg_trgm` (crees en SQL brut hors du schema declaratif, donc invisibles pour lui) : verifie et retire avant application pour ne pas casser la recherche tolerante aux fautes.

### Recherche / decouverte
- [x] Tri des produits (prix croissant/decroissant, plus recent, plus populaire - populaire = quantite vendue sur commandes payees)
- [x] Produits similaires / "vous aimerez aussi" sur la fiche produit (meme categorie, 4 produits)
- [x] Liste de souhaits / favoris (necessite compte) - coeur sur les cartes produit + page `/favoris`
- [x] Recherche plus tolerante aux fautes de frappe (extension `pg_trgm`, similarite sur titre/description)
- [x] Categories vides masquees de l'accueil et du catalogue
  - Note (2026-08-05) : les categories sans aucun produit publie (boutique active) restaient cliquables et menaient vers une page vide - meme filtre que celui deja utilise pour la boutique "a la une" (`products: { some: { status: "PUBLISHED", shop: { status: "ACTIVE" } } }`), applique aux deux requetes de categories qui ne l'avaient pas.

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
- [x] Refonte editoriale de la carte produit (`components/shop/product-card.tsx`) - jugee "banale/archaique" (grille e-commerce generique, photo carree, badge prix flottant, nom de boutique en petit texte gris)
  - Note (2026-07-27) : maquette validee avant implementation (voir echange). Coins quasi droits au lieu du bubble tres arrondi, fin trait separant photo et texte (esprit cartel de musee), nom de la piece en Fraunces a plus grande echelle, nom de la boutique/artisan traite comme une signature (italique, couleur primaire) plutot qu'une legende grise, prix retire de la photo et deplace dans une ligne discrete avec la note. Ajoute au passage le style italique de Fraunces via `next/font` (necessaire pour un vrai italique, pas une oblique synthetique). Ce composant est partage par l'accueil, le catalogue, la page boutique et les favoris - un seul changement profite a tout le site.
  - Fix (2026-07-27) : titre sur 1 vs 2 lignes decalait differemment le nom de boutique et le prix d'une carte a l'autre sur la meme rangee (repere en conditions reelles apres deploiement) - premiere tentative : hauteur de titre fixe (2 lignes reservees). Corrige un 2e probleme sur mobile : cette hauteur reservee laissait un grand vide entre un titre court et son prix (repere sur la page boutique via capture reelle), rendant le prix illisible/associable a tort. Remplace par une carte en colonne flex (`mt-auto` pousse prix/note en bas de la carte etiree par la grille) - aligne toujours les rangees desktop sans creer de vide artificiel sur mobile (une carte seule dans sa rangee n'est pas etiree).
  - Ajustement (2026-07-27) : photo repassee en 1:1 (carre) apres revue sur contenu reel - le ratio 4:5 (portrait) initial de la maquette rendait les photos trop hautes/imposantes une fois avec de vraies photos de bijoux. Compare 4:5 / 1:1 / 5:4 cote a cote avant de trancher.

### Support client
- [x] Chatbot d'assistance (widget flottant sur tout le site, `components/chatbot/chatbot-widget.tsx` + route `app/api/chatbot/route.ts`)
  - Note (2026-08-01) : modele `gemini-flash-latest` (Google, `@google/genai`) - alias maintenu par Google plutot qu'un nom de version fige (`gemini-2.5-flash` a d'ailleurs ete retire pour les nouveaux comptes en cours de session, d'ou ce choix). Niveau gratuit choisi pour eviter tout cout recurrent (l'essai initial avec l'API Anthropic a ete abandonne faute de credits sur ce compte). Reponses en streaming. Prompt systeme (`lib/chatbot.ts`) ancre uniquement dans les faits reels des CGV/politique de confidentialite/mentions legales (paiement Stripe, retractation 14 jours, livraison geree par chaque vendeur sans delai/tarif invente, etc.) - consigne explicite de ne jamais inventer une politique et de rediriger vers le formulaire de contact pour tout cas specifique a une commande. Reutilise le limiteur de debit existant (`lib/rate-limit.ts`, 20 messages/heure/IP) - important vu les quotas plus serres du niveau gratuit Gemini. Necessite une cle `GEMINI_API_KEY` (aistudio.google.com) dans `.env.local` et sur Vercel - sans elle la route repond juste "assistant indisponible" au lieu de planter. Corrige au passage la page Contact qui affirmait a tort "pas de bot".

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
- [x] Page FAQ dediee (`/faq`)
  - Note (2026-08-05) : identifiee comme manquante lors d'un audit du site (seuls CGV + contact existaient jusque-la). 9 questions/reponses groupees en 4 categories (commander/payer, livraison/retours, vendre, compte/confidentialite), redigees uniquement a partir des faits deja confirmes ailleurs sur le site (CGV, confidentialite, mentions legales) - aucune politique inventee, dans le meme esprit que le prompt du chatbot. Donnees structurees `FAQPage` (JSON-LD) pour le SEO. Accordeon en `details`/`summary` natif, pas de JS necessaire. Lien ajoute au footer, a la page contact et au prompt du chatbot (qui peut desormais y rediriger).

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

- Audit du site (2026-07-27) : verification en conditions reelles (production, public) + revue de code pour les zones authentifiees (serveur local instable par manque de memoire ce jour-la pour re-tester en direct dashboard vendeur/admin - suite e2e existante gardee comme filet de securite). Deux bugs confirmes et corriges :
  - Des boutiques a 0 produit publie ("Atelier Test", "niala" - comptes de test) apparaissaient sur `/artisans`, triees plus recentes en premier, donc **avant** les vraies boutiques avec du contenu - mauvaise premiere impression pour un visiteur qui cliquait dessus. Corrige en filtrant `/artisans` aux boutiques ayant au moins un produit publie (`app/(marketing)/artisans/page.tsx`).
  - Incoherence de devise : la carte produit redessinee affichait "45.00 €" alors que les 15 autres endroits du site (panier, checkout, mes commandes, tableaux admin, dashboard vendeur, emails transactionnels) affichaient "45.00 EUR" en toutes lettres - une incoherence introduite sans s'en rendre compte pendant la refonte. Harmonise sur le symbole "€" partout. Laisse volontairement en "EUR" : la facture PDF (`lib/invoice.tsx`, rendu non re-verifiable sans serveur local ce jour-la), les en-tetes CSV et les libelles d'unite sur les champs de formulaire ("Prix (EUR)"), et le champ JSON-LD `priceCurrency` (le format schema.org exige le code ISO).
  - Points releves mais pas corriges (a trancher) : page de paiement et connexion/inscription visuellement en retrait par rapport au reste du site desormais plus soigne ; le blog n'a pas de photo de couverture par article.
