import { type ReactNode } from "react";
import { Kicker, Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/config/site";
import { resetConsent } from "@/lib/consent";
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

export default function Datenschutz() {
  const revoke = () => {
    resetConsent();
    window.location.reload();
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-32 pt-36 sm:pt-44">
      <Seo
        title="Datenschutzerklärung — PRJ1"
        description="Datenschutzerklärung von PRJ1 — Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO."
        path="/datenschutz"
      />

      <Kicker>Rechtliches</Kicker>
      <h1 className="u-display mt-6 text-[clamp(2.4rem,7vw,5.5rem)]">
        <Reveal>
          Datenschutz<em className="u-serif not-italic">erklärung.</em>
        </Reveal>
      </h1>

      <div className="mt-16">
        <Section title="1. Verantwortlicher">
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            <br />
            {SITE.founder}, {SITE.address.street}, {SITE.address.zip} {SITE.address.city},{" "}
            E-Mail:{" "}
            <a className="underline underline-offset-2 hover:text-[var(--color-foreground)]" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            .
          </p>
        </Section>

        <Section title="2. Hosting">
          <p>
            Diese Website wird bei der Hostinger International Ltd., 61 Lordou
            Vironos Street, 6023 Larnaca, Zypern („Hostinger“) gehostet. Beim
            Aufruf der Website verarbeitet Hostinger in unserem Auftrag
            technisch notwendige Daten (sog. Server-Logfiles), darunter
            IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite,
            Browsertyp und Betriebssystem. Die Verarbeitung erfolgt auf
            Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            der sicheren und stabilen Bereitstellung der Website). Logfiles
            werden nach kurzer Zeit automatisch gelöscht. Mit Hostinger besteht
            ein Vertrag über Auftragsverarbeitung gemäß Art. 28 DSGVO.
          </p>
        </Section>

        <Section title="3. Schriftarten und externe Inhalte">
          <p>
            Alle Schriftarten dieser Website sind lokal eingebunden. Beim
            Seitenaufruf werden keine Verbindungen zu Google Fonts oder anderen
            Font-Diensten aufgebaut.
          </p>
        </Section>

        <Section title="4. Kontaktaufnahme">
          <p>
            Wenn du uns per E-Mail oder über das Kontaktformular
            kontaktierst, verarbeiten wir die übermittelten Angaben (Name,
            E-Mail-Adresse, ggf. Unternehmen, Budgetrahmen und Nachricht)
            ausschließlich zur Bearbeitung deiner Anfrage. Rechtsgrundlage ist
            Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6
            Abs. 1 lit. f DSGVO. Die Daten werden gelöscht, sobald sie für die
            Bearbeitung nicht mehr erforderlich sind und keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen.
          </p>
          <p>
            Für den technischen Versand des Kontaktformulars nutzen wir ggf.
            den Dienst Web3Forms. Dabei werden die Formularinhalte zur
            Zustellung per E-Mail verarbeitet; eine dauerhafte Speicherung beim
            Anbieter findet nach dessen Angaben nicht statt.
          </p>
        </Section>

        <Section title="5. Google Analytics (nur mit Einwilligung)">
          <p>
            Diese Website nutzt Google Analytics, einen Webanalysedienst der
            Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
            Irland — jedoch ausschließlich, wenn du über unseren Cookie-Banner
            eingewilligt hast (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG).
            Ohne Einwilligung werden keine Analyse-Cookies gesetzt und keine
            Daten an Google übertragen.
          </p>
          <p>
            Bei aktivierter Analyse wird deine IP-Adresse gekürzt verarbeitet
            (IP-Anonymisierung). Die im Rahmen von Google Analytics erzeugten
            Informationen werden in der Regel an Server von Google übertragen
            und dort gespeichert; dabei kann es zu einer Übermittlung in die
            USA kommen. Google ist unter dem EU-US Data Privacy Framework
            zertifiziert.
          </p>
          <p>
            Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft
            widerrufen:
          </p>
          <p>
            <button
              type="button"
              onClick={revoke}
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-border)] px-6 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
            >
              Cookie-Einstellungen zurücksetzen
            </button>
          </p>
        </Section>

        <Section title="6. Deine Rechte">
          <p>
            Du hast gegenüber uns folgende Rechte hinsichtlich der dich
            betreffenden personenbezogenen Daten: Recht auf Auskunft (Art. 15
            DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
            Einschränkung der Verarbeitung (Art. 18 DSGVO),
            Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch gegen die
            Verarbeitung (Art. 21 DSGVO). Erteilte Einwilligungen kannst du
            jederzeit widerrufen. Zudem hast du das Recht, dich bei einer
            Datenschutz-Aufsichtsbehörde zu beschweren — zuständig ist u. a.
            der Hamburgische Beauftragte für Datenschutz und
            Informationsfreiheit.
          </p>
        </Section>

        <Section title="7. SSL-Verschlüsselung">
          <p>
            Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw.
            TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennst du an
            „https://“ in der Adresszeile deines Browsers.
          </p>
        </Section>

        <Section title="8. Aktualität">
          <p>
            Diese Datenschutzerklärung ist aktuell gültig (Stand: Juni 2026).
            Durch die Weiterentwicklung der Website oder geänderte gesetzliche
            Vorgaben kann eine Anpassung erforderlich werden.
          </p>
        </Section>
      </div>
    </main>
  );
}
