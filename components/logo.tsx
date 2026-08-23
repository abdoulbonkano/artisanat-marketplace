import type { ComponentPropsWithoutRef, SVGProps } from "react";

/**
 * Le mark Façonné : le rebord imparfait d'une poterie tournée à la main.
 * Monochrome (currentColor) pour s'adapter à n'importe quel fond (badge
 * primaire, texte sombre/clair, favicon).
 */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M50 10 C74 10 90 28 88 52 C86 76 68 90 46 88 C24 86 10 66 14 44 C17 26 30 10 50 10 Z"
        stroke="currentColor"
        strokeWidth="6"
      />
      <path d="M36 50 Q50 38 64 50 Q50 62 36 50 Z" fill="currentColor" opacity="0.55" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

/**
 * Le nom de marque avec le "ç" traité comme un accent de signature
 * (italique, couleur primaire) - repris de la planche d'identite.
 */
export function Wordmark({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span className={className} {...props}>
      Fa<em className="text-primary italic">ç</em>onné
    </span>
  );
}
