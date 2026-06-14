import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { FadeIn, Kicker, Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/config/site";
import Seo, { JsonLd } from "@/lib/seo";

type Status = "idle" | "sending" | "success" | "error";

const budgets = [
  "Essenz — ab 1.200 € / Monat",
  "Signatur — ab 2.800 € / Monat",
  "Atelier — ab 6.000 € / Monat",
  "Individuell / noch unklar",
];

const inputClass =
  "w-full border-b border-[var(--color-input)] bg-transparent py-3 text-base text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50 transition-colors duration-300 focus:border-[var(--color-foreground)] focus:outline-none";

function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="u-kicker block">
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal opacity-80">(optional)</span>}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function Kontakt() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: bots fill every field — silently drop those submissions.
    if (data.get("_gotcha")) return;

    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const company = String(data.get("company") ?? "");
    const budget = String(data.get("budget") ?? "");
    const message = String(data.get("message") ?? "");

    // No Web3Forms key configured yet → hand over to the mail client.
    if (!SITE.web3formsKey) {
      const body = [
        message,
        "",
        "—",
        `Name: ${name}`,
        company && `Unternehmen: ${company}`,
        budget && `Budget: ${budget}`,
        `E-Mail: ${email}`,
      ]
        .filter(Boolean)
        .join("\n");
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
        `Projektanfrage von ${name}`,
      )}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: SITE.web3formsKey,
          subject: `Projektanfrage von ${name} — prj1.de`,
          from_name: "PRJ1 Website",
          name,
          email,
          company,
          budget,
          message,
        }),
      });
      const json = (await res.json()) as { success: boolean };
      setStatus(json.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="relative px-6 pb-32 pt-36 sm:px-10 sm:pt-44">
      <Seo
        title="Kontakt — PRJ1"
        description="Projekt anfragen bei PRJ1, Webdesign Studio aus Hamburg. Wir antworten innerhalb von 24 Stunden — ehrlich und unverbindlich."
        path="/kontakt"
      />
      <JsonLd
        data={{
          "@type": "ContactPage",
          name: "Kontakt — PRJ1",
          url: `${SITE.url}/kontakt`,
        }}
      />

      <header className="mx-auto max-w-7xl">
        <Kicker>Kontakt</Kicker>
        <h1 className="u-display mt-6 text-[clamp(2.8rem,9vw,7.5rem)]">
          <Reveal>
            Sag <em className="u-serif not-italic">Hallo.</em>
          </Reveal>
        </h1>
        <FadeIn delay={0.2}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-[var(--color-muted-foreground)] sm:text-lg">
            Erzähl uns kurz, was du vorhast — wir melden uns innerhalb von
            24 Stunden mit einer ehrlichen Einschätzung. Unverbindlich.
          </p>
        </FadeIn>
      </header>

      <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
        {/* Direct channels ------------------------------------------------ */}
        <FadeIn className="order-2 lg:order-1">
          <div className="space-y-10 border-t border-[var(--color-border)] pt-10">
            <div>
              <h2 className="u-kicker">E-Mail</h2>
              <a
                href={`mailto:${SITE.email}`}
                className="group mt-3 inline-flex items-center gap-2 text-xl font-semibold tracking-tight transition-colors hover:text-[var(--color-muted-foreground)] sm:text-2xl"
              >
                {SITE.email}
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
            <div>
              <h2 className="u-kicker">Telefon</h2>
              <a
                href={SITE.phoneHref}
                className="mt-3 inline-block text-xl font-semibold tracking-tight transition-colors hover:text-[var(--color-muted-foreground)] sm:text-2xl"
              >
                {SITE.phone}
              </a>
            </div>
            <div>
              <h2 className="u-kicker">Studio</h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--color-muted-foreground)]">
                {SITE.address.street}
                <br />
                {SITE.address.zip} {SITE.address.city}
                <br />
                {SITE.address.country}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-foreground)]/50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-foreground)]" />
              </span>
              <span className="u-kicker">Verfügbar für neue Projekte</span>
            </div>
          </div>
        </FadeIn>

        {/* Form ------------------------------------------------------------ */}
        <FadeIn delay={0.1} className="order-1 lg:order-2">
          {status === "success" ? (
            <div className="flex h-full min-h-72 flex-col items-start justify-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-10">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-foreground)] text-[var(--color-background)]">
                <Check className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="u-display mt-6 text-3xl">Danke!</h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[var(--color-muted-foreground)]">
                Deine Anfrage ist angekommen. Wir melden uns innerhalb von
                24 Stunden bei dir — versprochen.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-8" noValidate={false}>
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <Field label="Name" htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Wie heißt du?"
                    className={inputClass}
                  />
                </Field>
                <Field label="E-Mail" htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@firma.de"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <Field label="Unternehmen" htmlFor="company" optional>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Deine Marke"
                    className={inputClass}
                  />
                </Field>
                <Field label="Budget" htmlFor="budget" optional>
                  <select id="budget" name="budget" defaultValue="" className={`${inputClass} appearance-none`}>
                    <option value="" disabled className="bg-[var(--color-background)]">
                      Bitte wählen …
                    </option>
                    {budgets.map((b) => (
                      <option key={b} value={b} className="bg-[var(--color-background)]">
                        {b}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Projekt" htmlFor="message">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Worum geht es? Ein paar Sätze reichen völlig."
                  className={`${inputClass} resize-y`}
                />
              </Field>

              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 flex-none accent-[var(--color-foreground)]"
                />
                <span>
                  Ich habe die{" "}
                  <Link to="/datenschutz" className="underline underline-offset-2 hover:text-[var(--color-foreground)]">
                    Datenschutzerklärung
                  </Link>{" "}
                  gelesen und bin mit der Verarbeitung meiner Angaben zur
                  Bearbeitung der Anfrage einverstanden.
                </span>
              </label>

              {status === "error" && (
                <p role="alert" className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-sm text-[var(--color-foreground)]">
                  Das hat leider nicht geklappt. Versuch es noch einmal oder
                  schreib uns direkt an{" "}
                  <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">
                    {SITE.email}
                  </a>
                  .
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex min-h-13 w-full items-center justify-center rounded-full bg-[var(--color-foreground)] px-8 text-sm font-semibold text-[var(--color-background)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 sm:w-auto"
              >
                {status === "sending" ? "Wird gesendet …" : "Anfrage senden"}
              </button>
            </form>
          )}
        </FadeIn>
      </div>
    </main>
  );
}
