export function EntretienArticle() {
  return (
    <>
      <section className="flex flex-col gap-3">
        <p className="text-base leading-relaxed text-muted-foreground">
          Une piece artisanale n&apos;est pas un bijou de fantaisie jetable :
          bien entretenue, elle traverse les annees. Voici les bons gestes
          selon le materiau.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium tracking-tight">
          Bijoux en bronze
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Le bronze fonce naturellement avec le temps : cette patine n&apos;est
          pas un defaut, c&apos;est la reaction normale du metal au contact de
          l&apos;air et de la peau. Si vous preferez un aspect plus clair et
          brillant :
        </p>
        <ul className="list-disc pl-5 text-base leading-relaxed text-muted-foreground">
          <li>
            Nettoyez avec un chiffon doux et, si besoin, un peu d&apos;eau
            tiede savonneuse - puis sechez immediatement.
          </li>
          <li>
            Evitez tout contact avec parfum, creme ou lotion avant de le
            porter : ces produits accelerent le ternissement.
          </li>
          <li>
            Rangez la piece a l&apos;abri de l&apos;humidite, idealement dans
            une pochette individuelle.
          </li>
          <li>
            Un petit polissage occasionnel au chiffon doux suffit a raviver
            l&apos;eclat - inutile de recourir a des produits abrasifs.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium tracking-tight">
          Bijoux en argent
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          L&apos;argent ternit au contact de l&apos;air et de certains
          produits chimiques. Quelques reflexes simples limitent ce
          phenomene :
        </p>
        <ul className="list-disc pl-5 text-base leading-relaxed text-muted-foreground">
          <li>
            Retirez vos bijoux avant la douche, la piscine et le sport - le
            chlore et la transpiration accelerent le ternissement.
          </li>
          <li>
            Nettoyez-les avec un chiffon dedie au polissage de l&apos;argent
            plutot qu&apos;avec un produit menager.
          </li>
          <li>
            Conservez-les dans une pochette hermetique ou une boite fermee, a
            l&apos;abri de la lumiere et de l&apos;humidite.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium tracking-tight">
          Ceramiques et gres emaille
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          Les pieces en gres emaille sont solides mais restent sensibles aux
          chocs thermiques et aux frottements abrasifs :
        </p>
        <ul className="list-disc pl-5 text-base leading-relaxed text-muted-foreground">
          <li>
            Privilegiez un lavage a la main plutot qu&apos;au lave-vaisselle
            pour les pieces decoratives.
          </li>
          <li>
            Evitez les ecarts de temperature brutaux (par exemple passer du
            plein soleil a l&apos;eau froide).
          </li>
          <li>
            Utilisez une eponge douce : les eponges abrasives peuvent
            rayer l&apos;email a la longue.
          </li>
        </ul>
      </section>
    </>
  );
}
