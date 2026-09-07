import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site www.darestimate.ma — éditeur, hébergement, propriété intellectuelle et contacts.",
};

export default function MentionsPage() {
  return (
    <div className="bg-background py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-gold">
            Informations légales
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Mentions légales
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Dernière mise à jour : janvier 2026
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {/* Éditeur */}
          <section>
            <h2 className="font-display text-xl font-semibold">
              Éditeur du site
            </h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                Le site www.darestimate.ma est édité par la société DarEstate
                SARL, société à responsabilité limitée au capital de 100 000
                dirhams, dont le siège social est situé au Twin Center, Bureau
                1204, Boulevard Zerktouni, Casablanca, Maroc.
              </p>
              <p>
                Numéro de registre du commerce : RC 123456 · Patente : 12345678 ·
                Numéro ICE : 001234567000012 · CNSS : 1234567.
              </p>
              <p>
                Téléphone : +212 5 22 00 00 00 · E-mail :
                contact@darestate.ma
              </p>
            </div>
          </section>

          {/* Directeur de publication */}
          <section>
            <h2 className="font-display text-xl font-semibold">
              Directeur de publication
            </h2>
            <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Le directeur de publication est M. Youssef Benjelloun,
                Président-Directeur Général de DarEstate SARL.
              </p>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="font-display text-xl font-semibold">
              Hébergement
            </h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                Le site www.darestimate.ma est hébergé par la société Vercel
                Inc., dont le siège social est situé au 340 S Lemon Ave, Walnut,
                CA 91789, États-Unis.
              </p>
              <p>
                Les données personnelles des utilisateurs résident sur des
                serveurs sécurisés situés dans l&apos;Union européenne
                (Frankfurt, Allemagne), conformément aux exigences de la loi
                marocaine 09-08 relative à la protection des données à caractère
                personnel.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-xl font-semibold">Contact</h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                Pour toute question relative au site ou pour exercer vos droits,
                vous pouvez nous contacter :
              </p>
              <p>
                Par courrier : DarEstate SARL, Twin Center, Bureau 1204,
                Boulevard Zerktouni, Casablanca, Maroc.
              </p>
              <p>
                Par e-mail : contact@darestate.ma
              </p>
              <p>
                Par téléphone : +212 5 22 00 00 00
              </p>
              <p>
                Service disponible du lundi au vendredi, de 9h00 à 18h00.
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="font-display text-xl font-semibold">
              Propriété intellectuelle
            </h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                L&apos;ensemble du contenu du site www.darestimate.ma — textes,
                photographies, vidéos, graphismes, logos, marques, noms
                commerciaux et logiciels — est la propriété exclusive de
                DarEstate SARL ou de ses partenaires et est protégé par les
                législations nationales et internationales relatives à la
                propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication,
                transmission ou dénaturation du site ou de son contenu, par
                quelque procédé que ce soit, est interdite sans autorisation
                préalable écrite de l&apos;éditeur. Le non-respect de cette
                interdiction peut constituer une contrefaçon susceptible d&apos;engager
                la responsabilité civile et pénale de son auteur.
              </p>
            </div>
          </section>

          {/* CNIL / ANRT */}
          <section>
            <h2 className="font-display text-xl font-semibold">
              Protection des données et régulateur
            </h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                Le traitement des données à caractère personnel est effectué
                conformément à la loi marocaine n° 09-08 relative à la
                protection des personnes physiques à l&apos;égard du traitement
                des données à caractère personnel, promulguée par le Dahir n° 1
                -09-18 du 18 février 2009.
              </p>
              <p>
                L&apos;autorité de régulation compétente est l&apos;Agence
                Nationale de Réglementation des Télécommunications (ANRT), qui
                veille au respect de cette loi par les opérateurs et éditeurs de
                sites internet traitant des données à caractère personnel au
                Maroc.
              </p>
              <p>
                Pour toute réclamation relative au traitement de vos données
                personnelles, vous pouvez contacter l&apos;ANRT : Autorité
                Nationale de Réglementation des Télécommunications, 2, rue
                Al Arz, Hay Riad, Rabat, Maroc. Site web : www.anrt.ma.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
