# Design system — Façonné

Identité de marque appliquée au site. Planche source : [`design/identite-marque.html`](design/identite-marque.html) (a ouvrir dans un navigateur pour la version illustree).

## Palette

| Nom | Hex | Usage | Token shadcn (`app/globals.css`) |
|---|---|---|---|
| Bois brule | `#2B2420` | Texte, structure | `--foreground` (light) / `--background` (dark) |
| Terre cuite | `#A8461F` | Signature, CTA, accents | `--primary`, `--accent` (light) |
| Terracotta claire | `#D08355` | Variante lisible sur fond sombre | `--primary`, `--accent` (dark) |
| Indigo | `#3C4A68` | Contraste, teinture | `--chart-2` |
| Sauge | `#7C8B65` | Validation, discret | `--chart-3` |
| Lin | `#EFE6D8` | Fond clair, respiration | `--background` (light) |
| Blanc casse | `#FBF8F2` | Cartes, surfaces elevees | `--card` / `--popover` (light) |
| Ink-soft | `#5A5049` | Texte secondaire | `--muted-foreground` (light) |

Toutes les valeurs sont converties en OKLCH dans `app/globals.css` (`:root` et `.dark`) - les noms de variables shadcn/Tailwind existants n'ont pas change, seules les valeurs ont ete remplacees. Les paires texte/fond ont ete verifiees au-dessus du seuil WCAG AA (4.5:1).

Primary et accent partagent la meme couleur (Terre cuite / Terracotta claire) : c'est la couleur signature unique de la marque, utilisee aussi bien pour les CTA que pour les mises en avant editoriales (eyebrows, prix, signature d'artisan).

## Typographie

Chargees via `next/font/google` dans `app/layout.tsx`, exposees comme `font-heading` / `font-sans` / `font-mono` (`app/globals.css`).

- **Bitter** (serif) — `font-heading`, titres `h1/h2/h3`, italique disponible pour les emphases (ex. le "ç" du wordmark).
- **Karla** (sans-serif) — `font-sans`, corps de texte, appliquee sur `<html>`.
- **Space Mono** (monospace) — `font-mono`, labels/eyebrows/tags en majuscules espacees.

## Logo

`components/logo.tsx` :
- `LogoMark` — le mark SVG (rebord de poterie tourne a la main), monochrome via `currentColor` pour s'adapter a n'importe quel fond.
- `Wordmark` — le nom "Façonné" avec le "ç" en italique couleur primaire (signature).

Favicon : `app/icon.svg` (convention Next.js App Router, remplace l'ancien `favicon.ico` par defaut).

## Ton de voix

- On raconte la piece et l'artisan (concret, factuel), jamais le rabais.
- On evite l'urgence commerciale ("SOLDES", "-50% aujourd'hui") et le jargon startup ("disruptif", "revolutionne").
- Exemple : *"Tourne a la main par Aïcha, dans son atelier de Bamako."* plutot que *"Notre marketplace disruptive..."*

Voir la section "04 — Ton de voix" de la planche source pour d'autres exemples.

## Nom de marque

`SITE_NAME` (`lib/site.ts`) = `"Façonné"`. Toute copie qui affiche le nom du site doit importer cette constante plutot que de la re-ecrire en dur.
