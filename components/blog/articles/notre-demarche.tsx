export function NotreDemarcheArticle() {
  return (
    <>
      <section className="flex flex-col gap-3">
        <p className="text-base leading-relaxed text-muted-foreground">
          Avant ce site, il n&apos;y avait pas de site du tout. La vente se
          faisait en direct : sur Leboncoin, sur Vinted, et sur des marches
          physiques. Des pieces d&apos;artisanat, notamment des bijoux,
          vendues une a une, a des gens qui posaient des questions, qui
          touchaient l&apos;objet, qui repartaient avec.
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          Cette marketplace ne remplace pas cette pratique, elle la
          formalise. L&apos;objectif n&apos;a jamais ete de devenir un
          catalogue anonyme parmi d&apos;autres, mais de garder ce qui
          fonctionnait deja - la relation directe entre la personne qui
          fabrique et la personne qui achete - en lui donnant un cadre plus
          clair.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium tracking-tight">
          Un partenariat reel, pas une importation anonyme
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Les pieces vendues sur ce site viennent d&apos;artisans partenaires
          au Niger. Ce n&apos;est pas une relation acheteur-fournisseur
          impersonnelle : c&apos;est un partenariat suivi, que nous voulons
          rendre plus visible plutot que de le laisser derriere une marque
          sans visage. C&apos;est aussi pour ca que la page{" "}
          <a href="/artisans" className="underline hover:text-foreground">
            Nos artisans
          </a>{" "}
          existe : chaque boutique correspond a une personne reelle, pas a un
          entrepot.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium tracking-tight">
          Ce que &laquo;&nbsp;sans intermediaire&nbsp;&raquo; veut dire
          concretement
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Pas de revendeur qui multiplie le prix par trois entre l&apos;atelier
          et la boutique. Pas de fiche produit generique copiee-collee. Chaque
          objet mis en ligne a ete choisi et decrit avec l&apos;artisan qui l&apos;a
          faconne, et l&apos;argent d&apos;une vente revient directement a la
          personne qui a fait le travail.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium tracking-tight">
          Et la suite ?
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Le principe reste le meme qu&apos;au premier jour sur Leboncoin :
          des pieces uniques, faconnees a la main, vendues en direct. La
          marketplace nous permet simplement d&apos;accueillir progressivement
          d&apos;autres artisans independants qui partagent cette maniere de
          travailler.
        </p>
      </section>
    </>
  );
}
