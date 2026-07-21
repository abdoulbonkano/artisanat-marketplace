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
- [ ] Audit complet du site sur mobile reel (pas seulement desktop) : header, hero, formulaires, dashboard vendeur, checkout
  - Note (2026-07-21) : verifie via emulation Playwright (viewport iPhone 13) uniquement, pas de test sur un vrai appareil physique - a refaire idealement sur un telephone reel avant de cocher definitivement.

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
- [ ] Statistiques de vente basiques (revenus sur 30j, produits les plus vendus)
- [ ] Export des commandes en CSV pour la compta du vendeur
- [ ] Notification visuelle (badge) sur nouvelle commande, pas seulement nouveau message

### Design / UX
- [ ] Galerie photo avec zoom/lightbox sur la fiche produit (actuellement vignettes minuscules)
- [ ] Etats de chargement (skeleton) pour eviter le flash de contenu vide
- [ ] Page 404 personnalisee (actuellement page generique Next.js)
- [ ] Dark mode fonctionnel (les variables CSS existent deja dans globals.css, il manque juste le toggle)
- [ ] Animations de transition entre pages

### Legal / conformite
- [ ] Bandeau de consentement cookies (a valider avec un professionnel du droit - les mentions legales actuelles disent "cookies necessaires uniquement", a confirmer que ca suffit legalement)
- [ ] Page Politique de confidentialite dediee (actuellement fondue dans les mentions legales)

### Securite
- [ ] Rate limiting sur connexion, inscription, formulaire de contact (protection anti-bot/anti-brute-force)
- [ ] Captcha ou equivalent sur inscription si le spam devient un probleme

---

## P2 — Confort

### Paiement
- [ ] Stripe Connect (reversement automatique aux vendeurs) - gros chantier, a faire quand le nombre de vendeurs justifie de ne plus reverser manuellement
- [ ] Activer Apple Pay / Google Pay sur Stripe Checkout (rapide a activer, cote configuration Stripe)
- [ ] Codes promo / reductions

### Admin
- [ ] Graphiques sur le tableau de bord admin (evolution des ventes, inscriptions)
- [ ] Gestion des remboursements Stripe directement depuis l'admin
- [ ] Log d'activite / audit trail des actions admin (qui a approuve/suspendu quoi et quand)

### Contenu
- [ ] Vrai contenu blog (actuellement page "bientot disponible")
- [ ] Photos presentables pour les bijoux en argent (dossier en attente, evoque en session precedente)
- [ ] Elargir le catalogue / recruter plus d'artisans partenaires

### SEO / performance avance
- [ ] Donnees structurees JSON-LD (schema.org Product, Organization) pour les rich snippets Google et Google Shopping
- [ ] Audit Lighthouse (performance, accessibilite, SEO) et corriger les points faibles
- [ ] Verifier la taille/le format des images produits (compression, formats modernes)

### Accessibilite
- [ ] Audit contraste couleurs (WCAG AA minimum)
- [ ] Navigation clavier complete (tab, focus visible partout)
- [ ] Attributs ARIA sur les composants interactifs (menus, modales, formulaires)

---

## P3 — Plus tard / a plus grande echelle

- [ ] Tests automatises (unitaires + end-to-end) - fragile sans, mais gros investissement initial
- [ ] Monitoring d'erreurs en production (Sentry ou equivalent)
- [ ] Analytics (Plausible ou Google Analytics) pour suivre trafic/conversion
- [ ] CI/CD avec verifications avant deploiement (actuellement deploiement direct sans etape de validation automatique)
- [ ] Sauvegardes base de donnees automatisees et testees (verifier ce que Neon fait deja nativement)
- [ ] Connexion via Google/autre fournisseur OAuth (confort, pas critique)
- [ ] 2FA sur les comptes vendeur/admin
- [ ] Multi-langue / multi-devise (pas pertinent tant que le marche cible reste la France/zone euro)
- [ ] Application mobile native (tres long terme, seulement si le trafic mobile web le justifie)

---

## Notes de suivi

- Les emails transactionnels et les avis sont probablement les deux items qui debloquent le plus de valeur d'un coup — a discuter en premier pour l'ordre de developpement.
- Le webhook auto-deploy GitHub -> Vercel a deja saute une fois sans raison connue (voir session du 2026-07-21) — a surveiller, potentiellement a reconfigurer.
- Le bug d'image cassee sur le produit "Vase en gres emaille" (boutique Fil et Terre) releve le 2026-07-20 reste non corrige.
