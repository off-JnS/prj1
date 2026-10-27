import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Kicker, Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/config/site";
import Seo from "@/lib/seo";

/** Date of the current version — bump whenever the contract changes. */
const STAND = "Oktober 2026";

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

function Ul({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5">{children}</ul>;
}

const linkClass = "underline underline-offset-2 hover:text-[var(--color-foreground)]";
const address = `${SITE.founder}, ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}`;

/** Subprocessors — keep in sync with the hosting section of /datenschutz. */
const SUBPROCESSORS = [
  {
    name: "Hostinger International Ltd.",
    address: "61 Lordou Vironos Street, 6023 Larnaca, Zypern",
    service: "Webhosting, E-Mail-Hosting, Domain-Registrierung",
    location: "Rechenzentrum in der Europäischen Union",
  },
];

export default function Auftragsverarbeitung() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-32 pt-36 sm:pt-44">
      <Seo
        title="Auftragsverarbeitungsvertrag — PRJ1"
        description="Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO für Hosting und Wartung von Websites durch PRJ1."
        path="/auftragsverarbeitung"
      />

      <Kicker>Rechtliches</Kicker>
      <h1 className="u-display mt-6 text-[clamp(2.2rem,6.4vw,5rem)]">
        <Reveal>
          Auftrags<em className="u-serif not-italic">verarbeitung.</em>
        </Reveal>
      </h1>
      <p className="mt-8 max-w-2xl text-base leading-relaxed text-[var(--color-muted-foreground)]">
        Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Er gilt für alle Kundinnen und Kunden, deren Website
        wir im Rahmen eines Wartungsvertrags hosten oder betreuen, und ist Bestandteil dieses Vertrags (siehe{" "}
        <Link to="/vertragsbedingungen" className={linkClass}>
          Vertragsbedingungen
        </Link>
        , § 12).
      </p>
      <p className="u-kicker mt-8">Stand: {STAND}</p>

      <div className="mt-16">
        <Section title="§ 1 Parteien und Gegenstand">
          <Ol>
            <li>
              Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO ist der Kunde („Auftraggeber“). Auftragsverarbeiter
              ist {address} („PRJ1“, „Auftragnehmer“).
            </li>
            <li>
              Gegenstand ist die Verarbeitung personenbezogener Daten, die bei Hosting, Wartung und Betreuung der
              Website des Auftraggebers anfällt. Art und Umfang der Leistungen ergeben sich aus dem
              Wartungsvertrag („Hauptvertrag“).
            </li>
            <li>Die Laufzeit dieses Vertrags richtet sich nach der Laufzeit des Hauptvertrags.</li>
          </Ol>
        </Section>

        <Section title="§ 2 Art, Zweck und Umfang der Verarbeitung">
          <p>
            <strong className="font-semibold text-[var(--color-foreground)]">Zweck:</strong> Bereitstellung,
            Betrieb, Sicherung und Pflege der Website des Auftraggebers, einschließlich Kontaktformularen und
            E-Mail-Postfächern, soweit Teil des Hauptvertrags.
          </p>
          <p>
            <strong className="font-semibold text-[var(--color-foreground)]">Art der Verarbeitung:</strong>{" "}
            Speichern, Hosten, Übermitteln, Sichern (Backups), Wiederherstellen und Löschen.
          </p>
          <p>
            <strong className="font-semibold text-[var(--color-foreground)]">Arten von Daten:</strong>
          </p>
          <Ul>
            <li>Verbindungs- und Nutzungsdaten (IP-Adresse, Zeitpunkt, aufgerufene Seiten, Browser-Angaben in Server-Logfiles)</li>
            <li>Kontakt- und Kommunikationsdaten (z. B. Name, E-Mail-Adresse, Telefonnummer, Nachrichteninhalte aus Formularen)</li>
            <li>Inhaltsdaten, die der Auftraggeber auf der Website veröffentlicht oder in E-Mail-Postfächern speichert</li>
          </Ul>
          <p>
            <strong className="font-semibold text-[var(--color-foreground)]">Betroffene Personen:</strong> Besucher
            der Website, Interessenten und Kunden des Auftraggebers, die ihn über die Website oder per E-Mail
            kontaktieren, sowie Beschäftigte des Auftraggebers.
          </p>
          <p>
            Besondere Kategorien personenbezogener Daten (Art. 9 DSGVO) werden nur verarbeitet, wenn der
            Auftraggeber sie selbst über die Website erhebt; er informiert uns darüber vorab.
          </p>
        </Section>

        <Section title="§ 3 Weisungen">
          <Ol>
            <li>
              Wir verarbeiten die Daten nur auf dokumentierte Weisung des Auftraggebers, es sei denn, wir sind
              gesetzlich zu einer Verarbeitung verpflichtet; dann teilen wir ihm das vorher mit, soweit das
              Gesetz es nicht verbietet.
            </li>
            <li>
              Der Hauptvertrag und dieser Vertrag sind die Weisungen. Weitere Weisungen erteilt der Auftraggeber
              in Textform.
            </li>
            <li>
              Halten wir eine Weisung für datenschutzwidrig, weisen wir den Auftraggeber unverzüglich darauf hin
              und dürfen ihre Ausführung bis zur Bestätigung oder Änderung aussetzen.
            </li>
          </Ol>
        </Section>

        <Section title="§ 4 Pflichten des Auftragnehmers">
          <Ol>
            <li>
              Personen, die bei uns Zugang zu den Daten haben, sind zur Vertraulichkeit verpflichtet oder
              unterliegen einer gesetzlichen Verschwiegenheitspflicht.
            </li>
            <li>
              Wir treffen die technischen und organisatorischen Maßnahmen nach Art. 32 DSGVO, die in Anlage 1
              beschrieben sind. Wir dürfen sie weiterentwickeln, solange das Schutzniveau nicht sinkt.
            </li>
            <li>
              Wir unterstützen den Auftraggeber mit geeigneten Maßnahmen dabei, Anfragen betroffener Personen
              (Art. 12–22 DSGVO) zu beantworten. Richtet sich eine betroffene Person direkt an uns, leiten wir die
              Anfrage unverzüglich weiter.
            </li>
            <li>
              Wir unterstützen den Auftraggeber bei seinen Pflichten aus Art. 32 bis 36 DSGVO (Sicherheit,
              Meldung von Datenschutzverletzungen, Datenschutz-Folgenabschätzung, vorherige Konsultation).
            </li>
            <li>
              Verletzungen des Schutzes personenbezogener Daten melden wir dem Auftraggeber unverzüglich, in der
              Regel innerhalb von 24 Stunden nach Kenntnis, mit den Angaben nach Art. 33 Abs. 3 DSGVO, soweit sie
              uns vorliegen.
            </li>
            <li>
              Die Verarbeitung findet in der Europäischen Union statt. Eine Übermittlung in ein Drittland erfolgt
              nur, wenn die Voraussetzungen der Art. 44 ff. DSGVO erfüllt sind und der Auftraggeber zugestimmt
              hat.
            </li>
          </Ol>
        </Section>

        <Section title="§ 5 Unterauftragsverarbeiter">
          <Ol>
            <li>
              Der Auftraggeber stimmt dem Einsatz der in Anlage 2 genannten Unterauftragsverarbeiter zu.
            </li>
            <li>
              Wir informieren den Auftraggeber mindestens 30 Tage vorher in Textform, wenn wir einen
              Unterauftragsverarbeiter hinzuziehen oder ersetzen wollen. Der Auftraggeber kann der Änderung aus
              wichtigem datenschutzrechtlichem Grund innerhalb dieser Frist widersprechen. Können wir die Leistung
              dann nicht ohne den neuen Unterauftragsverarbeiter erbringen, können beide Seiten den Hauptvertrag
              zum Zeitpunkt der Änderung kündigen.
            </li>
            <li>
              Wir verpflichten Unterauftragsverarbeiter vertraglich auf dieselben Datenschutzpflichten, die in
              diesem Vertrag festgelegt sind, und bleiben gegenüber dem Auftraggeber für sie verantwortlich.
            </li>
          </Ol>
        </Section>

        <Section title="§ 6 Nachweise und Kontrollen">
          <p>
            Wir stellen dem Auftraggeber alle Informationen zur Verfügung, die zum Nachweis der Einhaltung dieses
            Vertrags nötig sind, und ermöglichen Überprüfungen durch ihn oder einen von ihm beauftragten Prüfer,
            der zur Verschwiegenheit verpflichtet ist. Vor-Ort-Kontrollen kündigt der Auftraggeber mit
            angemessener Frist an, führt sie zu den üblichen Geschäftszeiten durch und stört den Betrieb nicht
            mehr als nötig. Bei Unterauftragsverarbeitern genügen in der Regel deren aktuelle Zertifikate oder
            Prüfberichte.
          </p>
        </Section>

        <Section title="§ 7 Pflichten des Auftraggebers">
          <Ol>
            <li>
              Der Auftraggeber ist für die Rechtmäßigkeit der Verarbeitung verantwortlich, insbesondere für die
              Rechtsgrundlage, die Information der betroffenen Personen (z. B. in seiner Datenschutzerklärung)
              und, soweit nötig, die Einholung von Einwilligungen.
            </li>
            <li>Stellt er Fehler oder Unregelmäßigkeiten fest, informiert er uns unverzüglich.</li>
          </Ol>
        </Section>

        <Section title="§ 8 Löschung und Rückgabe">
          <p>
            Endet der Hauptvertrag, geben wir dem Auftraggeber nach seiner Wahl alle personenbezogenen Daten und
            die Website-Dateien heraus oder löschen sie, sofern keine gesetzliche Pflicht zur Speicherung besteht.
            Backups werden im regulären Rotationszyklus, spätestens nach 90 Tagen, gelöscht. Die Löschung bestätigen
            wir auf Wunsch in Textform.
          </p>
        </Section>

        <Section title="§ 9 Haftung und Schlussbestimmungen">
          <Ol>
            <li>Für die Haftung gilt Art. 82 DSGVO. Im Übrigen gelten die Haftungsregeln des Hauptvertrags.</li>
            <li>
              Bei Widersprüchen geht dieser Vertrag dem Hauptvertrag vor, soweit es um den Schutz
              personenbezogener Daten geht.
            </li>
            <li>
              Änderungen bedürfen der Textform. Sind einzelne Bestimmungen unwirksam, bleibt der Vertrag im
              Übrigen wirksam. Es gilt deutsches Recht.
            </li>
          </Ol>
        </Section>

        <Section title="Anlage 1 — Technische und organisatorische Maßnahmen">
          <p>
            <strong className="font-semibold text-[var(--color-foreground)]">Vertraulichkeit</strong>
          </p>
          <Ul>
            <li>Hosting in Rechenzentren des Unterauftragsverarbeiters mit Zutrittskontrolle, Videoüberwachung und Sicherheitspersonal</li>
            <li>Zugang zu Hosting-Konten nur mit individuellen Zugangsdaten und Zwei-Faktor-Authentifizierung</li>
            <li>Starke, einzigartige Passwörter, verwaltet in einem verschlüsselten Passwort-Manager</li>
            <li>Zugriff nur für Personen, die ihn für die Leistung brauchen</li>
            <li>Verschlüsselte Datenträger auf allen Arbeitsgeräten</li>
          </Ul>
          <p>
            <strong className="font-semibold text-[var(--color-foreground)]">Integrität</strong>
          </p>
          <Ul>
            <li>Übertragung ausschließlich verschlüsselt (HTTPS/TLS, SFTP/SSH)</li>
            <li>Änderungen an der Website nachvollziehbar über Versionsverwaltung</li>
          </Ul>
          <p>
            <strong className="font-semibold text-[var(--color-foreground)]">Verfügbarkeit und Belastbarkeit</strong>
          </p>
          <Ul>
            <li>Regelmäßige automatische Backups mit Wiederherstellungsmöglichkeit</li>
            <li>Uptime-Überwachung mit Benachrichtigung bei Ausfällen</li>
            <li>Zeitnahe Sicherheitsupdates der eingesetzten Software</li>
          </Ul>
          <p>
            <strong className="font-semibold text-[var(--color-foreground)]">Überprüfung und Datensparsamkeit</strong>
          </p>
          <Ul>
            <li>Regelmäßige Überprüfung der Maßnahmen und Zugänge</li>
            <li>Websites ohne unnötige Drittanbieter-Einbindungen und Tracking ohne Einwilligung</li>
          </Ul>
        </Section>

        <Section title="Anlage 2 — Unterauftragsverarbeiter">
          {SUBPROCESSORS.map((sp) => (
            <dl
              key={sp.name}
              className="grid grid-cols-1 gap-x-8 gap-y-1 border-y border-[var(--color-border)] py-5 sm:grid-cols-[10rem_1fr] sm:gap-y-3"
            >
              <dt className="font-semibold text-[var(--color-foreground)]">Unternehmen</dt>
              <dd className="mb-3 sm:mb-0">
                {sp.name}, {sp.address}
              </dd>
              <dt className="font-semibold text-[var(--color-foreground)]">Leistung</dt>
              <dd className="mb-3 sm:mb-0">{sp.service}</dd>
              <dt className="font-semibold text-[var(--color-foreground)]">Ort der Verarbeitung</dt>
              <dd>{sp.location}</dd>
            </dl>
          ))}
        </Section>
      </div>

      <p className="mt-10 text-sm text-[var(--color-muted-foreground)]">
        Eine unterschriebene Fassung für deine Unterlagen schicken wir dir gern zu:{" "}
        <a className={linkClass} href={`mailto:${SITE.email}?subject=${encodeURIComponent("AV-Vertrag")}`}>
          {SITE.email}
        </a>
      </p>
    </main>
  );
}
