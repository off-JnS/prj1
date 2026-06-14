import { type ReactNode } from "react";
import { Kicker, Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/config/site";
import Seo from "@/lib/seo";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[var(--color-border)] py-10 first:border-t-0">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--color-muted-foreground)] sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function Impressum() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-32 pt-36 sm:pt-44">
      <Seo
        title="Impressum — PRJ1"
        description="Impressum und rechtliche Angaben zu PRJ1, Webdesign Studio aus Hamburg."
        path="/impressum"
      />

      <Kicker>Rechtliches</Kicker>
      <h1 className="u-display mt-6 text-[clamp(2.4rem,7vw,5.5rem)]">
        <Reveal>Impressum.</Reveal>
      </h1>

      <div className="mt-16">
        <Section title="Angaben gemäß § 5 DDG">
          <p>
            {SITE.founder}
            <br />
            {SITE.address.street}
            <br />
            {SITE.address.zip} {SITE.address.city}
          </p>
        </Section>

        <Section title="Kontakt">
          <p>
            Telefon: <a className="underline underline-offset-2 hover:text-[var(--color-foreground)]" href={SITE.phoneHref}>{SITE.phone}</a>
            <br />
            E-Mail:{" "}
            <a className="underline underline-offset-2 hover:text-[var(--color-foreground)]" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </p>
        </Section>

        <Section title="Verbraucherstreitbeilegung / Universalschlichtungsstelle">
          <p>
            Wir nehmen nicht an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teil und sind dazu auch nicht
            verpflichtet.
          </p>
        </Section>

        <Section title="Haftung für Inhalte">
          <p>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>
        </Section>

        <Section title="Haftung für Links">
          <p>
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>
        </Section>

        <Section title="Urheberrecht">
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </Section>
      </div>
    </main>
  );
}
