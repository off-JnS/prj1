import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Kicker, Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/config/site";
import { buildPlans, MIN_TERM_MONTHS, ROUND_STEP } from "@/data/plans";
import Seo from "@/lib/seo";

/** Date of the current version — bump whenever the terms change. */
const STAND = "Oktober 2026 (Version 2)";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[var(--color-border)] py-10 first:border-t-0">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-[var(--color-muted-foreground)]">
        {children}
      </div>
    </section>
  );
}

function Ol({ children }: { children: ReactNode }) {
  return <ol className="list-decimal space-y-3 pl-5 marker:text-[var(--color-foreground)]">{children}</ol>;
}

const linkClass = "underline underline-offset-2 hover:text-[var(--color-foreground)]";
const address = `${SITE.founder}, ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}`;

export default function Vertragsbedingungen() {
  const starter = buildPlans[0];

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-32 pt-36 sm:pt-44">
      <Seo
        title="Vertragsbedingungen — PRJ1"
        description="Allgemeine Vertragsbedingungen von PRJ1 für Webdesign-Projekte und Wartungsverträge mit Unternehmern."
        path="/vertragsbedingungen"
      />

      <Kicker>Rechtliches</Kicker>
      <h1 className="u-display mt-6 text-[clamp(2.4rem,7vw,5.5rem)]">
        <Reveal>
          Vertrags<em className="u-serif not-italic">bedingungen.</em>
        </Reveal>
      </h1>
      <p className="u-kicker mt-8">Stand: {STAND}</p>

      <div className="mt-16">
        <Section title="§ 1 Geltungsbereich">
          <Ol>
            <li>
              Diese Vertragsbedingungen gelten für alle Verträge zwischen {address} („PRJ1“, „wir“) und
              seinen Kundinnen und Kunden („Kunde“) über die Gestaltung und Entwicklung von Websites
              („Website-Projekt“) sowie über Hosting, Wartung und Betreuung („Wartungsvertrag“).
            </li>
            <li>
              Unsere Angebote richten sich ausschließlich an Unternehmer im Sinne des § 14 BGB. Mit der
              Buchung bestätigt der Kunde, in Ausübung seiner gewerblichen oder selbständigen beruflichen
              Tätigkeit zu handeln. Verträge mit Verbrauchern (§ 13 BGB) schließen wir nicht.
            </li>
            <li>
              Abweichende Bedingungen des Kunden gelten nur, wenn wir ihnen ausdrücklich in Textform
              zustimmen. Individuelle Absprachen im Angebot gehen diesen Bedingungen vor.
            </li>
          </Ol>
        </Section>

        <Section title="§ 2 Vertragsschluss">
          <Ol>
            <li>
              Die Darstellung der Pakete auf dieser Website ist kein verbindliches Angebot, sondern eine
              Einladung, uns anzufragen.
            </li>
            <li>
              Ein Vertrag kommt zustande, wenn der Kunde unser Angebot in Textform (z. B. per E-Mail) annimmt
              oder wenn er ein Paket über einen auf dieser Website bereitgestellten Zahlungslink bucht und
              bezahlt. Im zweiten Fall bestätigen wir den Vertrag unverzüglich per E-Mail.
            </li>
            <li>Vertragssprache ist Deutsch. Den Vertragstext speichern wir und senden ihn auf Wunsch zu.</li>
          </Ol>
        </Section>

        <Section title="§ 3 Leistungsumfang">
          <Ol>
            <li>
              Der Umfang eines Website-Projekts ergibt sich aus dem gebuchten Paket (Starter, Professional
              oder Premium) in der zum Vertragsschluss auf der{" "}
              <Link to="/preise" className={linkClass}>
                Preisseite
              </Link>{" "}
              beschriebenen Fassung sowie aus dem Angebot. Leistungen, die dort nicht genannt sind, sind nicht
              geschuldet; wir bieten sie gern gesondert an.
            </li>
            <li>
              Wir gestalten und programmieren jede Website individuell. Ein bestimmtes Ranking in Suchmaschinen,
              bestimmte Besucherzahlen oder ein wirtschaftlicher Erfolg sind nicht geschuldet.
            </li>
            <li>
              Wir dürfen zur Leistungserbringung sorgfältig ausgewählte Dienstleister einsetzen (z. B.
              Hosting-Anbieter). Wir bleiben gegenüber dem Kunden verantwortlich.
            </li>
            <li>
              Wir erbringen keine Rechtsberatung. Rechtstexte wie Impressum oder Datenschutzerklärung binden
              wir technisch ein; für deren Inhalt ist der Kunde verantwortlich.
            </li>
          </Ol>
        </Section>

        <Section title="§ 4 Ablauf, Korrekturschleifen und Änderungswünsche">
          <Ol>
            <li>
              Ein Website-Projekt läuft in Phasen: Abstimmung, Entwurf, Umsetzung, Launch. Zu Entwurf und
              Umsetzung kann der Kunde jeweils gesammelte Änderungswünsche geben („Korrekturschleife“).
            </li>
            <li>
              Das Paket {starter.name} enthält zwei Korrekturschleifen, die Pakete Professional und Premium
              unbegrenzte Korrekturschleifen. Korrekturschleifen umfassen Anpassungen innerhalb des
              vereinbarten Umfangs und des freigegebenen Konzepts.
            </li>
            <li>
              Wünsche, die über den vereinbarten Umfang hinausgehen oder ein bereits freigegebenes Konzept
              grundlegend ändern, sind Zusatzleistungen. Wir nennen vorab den Aufwand und setzen sie erst
              nach Zustimmung des Kunden um.
            </li>
          </Ol>
        </Section>

        <Section title="§ 5 Mitwirkung des Kunden">
          <Ol>
            <li>
              Der Kunde stellt Inhalte (Texte, Bilder, Logos, Zugangsdaten) rechtzeitig und in geeigneter Form
              bereit, soweit sie nicht laut Paket von uns erstellt werden, und gibt Rückmeldungen in
              angemessener Frist.
            </li>
            <li>
              Der Kunde versichert, dass er an allen gelieferten Inhalten die nötigen Rechte hat, und stellt uns
              von Ansprüchen Dritter frei, die auf einer Verletzung dieser Pflicht beruhen. Das gilt nicht,
              wenn der Kunde die Verletzung nicht zu vertreten hat.
            </li>
            <li>
              Verzögert sich das Projekt, weil Mitwirkungen ausbleiben, verschieben sich vereinbarte Termine
              entsprechend.
            </li>
          </Ol>
        </Section>

        <Section title="§ 6 Abnahme">
          <Ol>
            <li>
              Nach Fertigstellung stellen wir die Website zur Abnahme bereit. Der Kunde prüft sie innerhalb von
              14 Tagen und erklärt die Abnahme oder nennt konkrete Mängel.
            </li>
            <li>
              Unwesentliche Mängel berechtigen nicht zur Verweigerung der Abnahme. Mit dem Launch auf Wunsch des
              Kunden gilt die Website als abgenommen.
            </li>
          </Ol>
        </Section>

        <Section title="§ 7 Preise und Zahlung">
          <Ol>
            <li>
              Website-Projekte werden zum Festpreis des gebuchten Pakets abgerechnet, Wartungsverträge
              monatlich. Alle Preise auf dieser Website sind Endpreise in Euro. Gemäß § 19 UStG wird keine
              Umsatzsteuer berechnet.
            </li>
            <li>
              Wird ein Paket über einen Zahlungslink gebucht, ist der volle Preis mit der Buchung fällig und
              wird über Stripe eingezogen. Bei individuellen Angeboten gelten die dort genannten
              Zahlungsbedingungen; ohne abweichende Vereinbarung sind 50 % bei Auftrag und 50 % bei Abnahme
              fällig.
            </li>
            <li>
              Wartungsentgelte sind monatlich im Voraus fällig. Zusatzleistungen nach § 4 Abs. 3 rechnen wir
              nach dem vorab genannten Aufwand ab.
            </li>
          </Ol>
        </Section>

        <Section title="§ 8 Wartungsvertrag, Laufzeit und Kombi-Rabatt">
          <Ol>
            <li>
              Der Leistungsumfang des Wartungsvertrags ergibt sich aus dem gebuchten Wartungspaket (Basic,
              Standard oder Premium). Wir betreiben die Website mit der Sorgfalt eines ordentlichen Anbieters;
              kurze Unterbrechungen für Wartung und Ausfälle von Drittanbietern außerhalb unseres Einflusses
              lassen sich nicht ausschließen.
            </li>
            <li>
              Wird ein Wartungsvertrag zusammen mit einem Website-Projekt gebucht, gewähren wir auf das
              Website-Projekt einen Rabatt („Kombi-Rabatt“). Der rabattierte Preis wird auf volle{" "}
              {ROUND_STEP} € zugunsten des Kunden abgerundet. Der Wartungsvertrag hat in diesem Fall eine
              Mindestlaufzeit von {MIN_TERM_MONTHS} Monaten ab Launch.
            </li>
            <li>
              Nach Ablauf der Mindestlaufzeit und bei Wartungsverträgen ohne Kombi-Rabatt läuft der Vertrag
              unbefristet und kann mit einer Frist von einem Monat zum Monatsende gekündigt werden. Die
              Kündigung bedarf der Textform (z. B. E-Mail an{" "}
              <a className={linkClass} href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              ).
            </li>
            <li>
              Endet ein Wartungsvertrag mit Kombi-Rabatt vor Ablauf der Mindestlaufzeit aus einem Grund, den
              der Kunde zu vertreten hat, wird der Kombi-Rabatt anteilig für die nicht erreichten Monate
              nachberechnet. Das Recht beider Seiten zur außerordentlichen Kündigung aus wichtigem Grund
              bleibt unberührt.
            </li>
            <li>
              Domains registrieren wir auf den Namen des Kunden. Endet der Wartungsvertrag, übergeben wir die
              Website-Dateien und unterstützen den Umzug der Domain (z. B. durch Herausgabe des Auth-Codes).
            </li>
          </Ol>
        </Section>

        <Section title="§ 9 Nutzungsrechte und Eigentum">
          <Ol>
            <li>
              Mit vollständiger Zahlung des Website-Projekts erhält der Kunde an Design, Code und den von uns
              erstellten Inhalten das ausschließliche, zeitlich und räumlich unbeschränkte und übertragbare
              Nutzungsrecht. Bis dahin dürfen wir die Nutzung untersagen.
            </li>
            <li>
              Für Bestandteile Dritter (z. B. Schriften, Bildmaterial, Open-Source-Bibliotheken) gelten deren
              Lizenzbedingungen. Wir setzen nur Bestandteile ein, deren Lizenz die vorgesehene Nutzung erlaubt,
              und nennen sie auf Wunsch.
            </li>
            <li>
              Allgemeines Wissen, Arbeitsweisen und nicht kundenspezifische Code-Bausteine dürfen wir weiter
              verwenden.
            </li>
            <li>
              Wir dürfen die fertige Website mit Namen und Screenshots als Referenz zeigen, z. B. im Portfolio.
              Der Kunde kann dem jederzeit in Textform widersprechen.
            </li>
          </Ol>
        </Section>

        <Section title="§ 10 Gewährleistung">
          <p>
            Es gelten die gesetzlichen Mängelrechte. Mängel beheben wir zunächst durch Nacherfüllung.
            Mängelansprüche verjähren in einem Jahr ab Abnahme; das gilt nicht für Ansprüche nach § 11 Abs. 1.
          </p>
        </Section>

        <Section title="§ 11 Haftung">
          <Ol>
            <li>
              Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper
              oder Gesundheit, nach dem Produkthaftungsgesetz und soweit wir eine Garantie übernommen haben.
            </li>
            <li>
              Bei leichter Fahrlässigkeit haften wir nur für die Verletzung wesentlicher Vertragspflichten,
              also solcher, deren Erfüllung den Vertrag überhaupt erst möglich macht und auf die der Kunde
              vertrauen darf. Die Haftung ist dann auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
            </li>
            <li>
              Für den Verlust von Daten haften wir nur in dem Umfang, der auch bei regelmäßiger Datensicherung
              entstanden wäre. Im Rahmen des Wartungsvertrags sichern wir die Website regelmäßig.
            </li>
          </Ol>
        </Section>

        <Section title="§ 12 Datenschutz">
          <p>
            Wie wir personenbezogene Daten verarbeiten, steht in unserer{" "}
            <Link to="/datenschutz" className={linkClass}>
              Datenschutzerklärung
            </Link>
            . Verarbeiten wir im Rahmen von Hosting oder Wartung personenbezogene Daten im Auftrag des Kunden,
            gilt unser{" "}
            <Link to="/auftragsverarbeitung" className={linkClass}>
              Vertrag zur Auftragsverarbeitung
            </Link>{" "}
            nach Art. 28 DSGVO als Bestandteil des Wartungsvertrags.
          </p>
        </Section>

        <Section title="§ 13 Schlussbestimmungen">
          <Ol>
            <li>
              Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
            </li>
            <li>
              Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches
              Sondervermögen, ist Gerichtsstand {SITE.address.city}.
            </li>
            <li>
              Sind einzelne Bestimmungen unwirksam, bleibt der Vertrag im Übrigen wirksam. An die Stelle der
              unwirksamen Bestimmung tritt die gesetzliche Regelung.
            </li>
          </Ol>
        </Section>
      </div>
    </main>
  );
}
