import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import Overlay from "@/components/ui/Overlay";
import { SITE } from "@/config/site";
import { buildReceipt, receiptToText, type ReceiptLine } from "@/lib/receipt";
import { type DiscountTier, type Plan } from "@/data/plans";
import { cn } from "@/lib/utils";

type SendStatus = "idle" | "sending" | "success" | "error";

/** Roughly one feed step per printed line, clamped so it never crawls. */
function stepsFor(lineCount: number) {
  return Math.min(28, Math.max(10, lineCount));
}

function PrintedLine({ line, index }: { line: ReceiptLine; index: number }) {
  // Stagger the ink so lines appear as they clear the slot.
  const style = { animationDelay: `${Math.min(index * 0.055, 1.8)}s` };

  switch (line.kind) {
    case "rule":
      return (
        <div
          className="receipt-line my-2 border-t border-dashed border-black/35"
          style={style}
          aria-hidden="true"
        />
      );
    case "double-rule":
      return (
        <div
          className="receipt-line my-2 border-t-[3px] border-double border-black/60"
          style={style}
          aria-hidden="true"
        />
      );
    case "gap":
      return <div className="h-3" aria-hidden="true" />;
    case "center":
      return (
        <p
          className={cn(
            "receipt-line text-center",
            line.strong
              ? "text-base font-bold uppercase tracking-[0.35em]"
              : "text-[11px] tracking-[0.12em]",
          )}
          style={style}
        >
          {line.text}
        </p>
      );
    case "kv":
      return (
        <p
          className={cn(
            "receipt-line flex items-baseline justify-between gap-3 text-[11px] leading-relaxed",
            line.strong && "text-sm font-bold",
          )}
          style={style}
        >
          <span className="uppercase tracking-[0.1em]">{line.label}</span>
          <span
            className="min-w-0 flex-1 self-center border-b border-dotted border-black/25"
            aria-hidden="true"
          />
          <span className="tabular-nums">{line.value}</span>
        </p>
      );
    case "text":
      return (
        <p className="receipt-line text-[10px] leading-relaxed" style={style}>
          {line.text}
        </p>
      );
  }
}

interface ReceiptProps {
  plan: Plan | undefined;
  tier: DiscountTier;
  open: boolean;
  onClose: () => void;
}

/**
 * The printed confirmation shown when Stripe returns the visitor to
 * `/preise?beleg=<plan>&rabatt=<tier>`.
 *
 * It is a *Beleg*, not an invoice, and says so on the paper. With no backend
 * the success return is only a URL parameter, so this document can't prove a
 * payment happened — Stripe's own e-mailed invoice does that. Labelling it
 * honestly is what keeps a spoofed `?beleg=` from being a forged record.
 */
export default function Receipt({ plan, tier, open, onClose }: ReceiptProps) {
  const model = useMemo(() => (plan ? buildReceipt(plan, tier) : null), [plan, tier]);

  const stripRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");

  // Measure the finished strip so the feed animation has a real target
  // height — `height: auto` can't be animated in discrete steps.
  useLayoutEffect(() => {
    if (!open || !model) return;
    const strip = stripRef.current;
    if (!strip) return;

    const measure = () => setHeight(strip.getBoundingClientRect().height);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    return () => observer.disconnect();
  }, [open, model]);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setHeight(null);
    }
  }, [open]);

  if (!model) return null;

  const text = receiptToText(model);
  const steps = stepsFor(model.lines.length);
  const subject = `Beleg ${model.number} — ${model.plan.name} · ${SITE.name}`;

  const onSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    // Same fallback the contact form uses: with no Web3Forms key configured,
    // hand the whole receipt to the visitor's mail client.
    if (!SITE.web3formsKey) {
      window.location.href = `mailto:${email || SITE.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(text)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: SITE.web3formsKey,
          subject,
          from_name: `${SITE.name} Beleg`,
          email,
          replyto: email,
          beleg: model.number,
          paket: model.plan.name,
          rabatt: model.tier ? `${model.tier} %` : "—",
          gesamt: `${model.gross.toFixed(2)} EUR`,
          message: text,
        }),
      });
      const json = (await res.json()) as { success: boolean };
      setStatus(json.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Overlay
      open={open}
      onClose={onClose}
      label={`Beleg ${model.number} für das Paket ${model.plan.name}`}
      className="max-w-md"
    >
      {/* Printer head — the slot the paper is pushed through. */}
      <div className="relative rounded-t-2xl border border-white/15 bg-gradient-to-b from-[oklch(0.22_0_0)] to-[oklch(0.12_0_0)] px-5 pb-4 pt-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="u-kicker text-white/50">{SITE.name} · Beleg</span>
          <span
            className="mr-10 h-1.5 w-1.5 animate-pulse rounded-full bg-white/70"
            aria-hidden="true"
          />
        </div>
        {/* The slot itself. */}
        <div
          className="mt-4 h-1.5 rounded-full bg-black shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
          aria-hidden="true"
        />
      </div>

      {/* Paper. The wrapper animates its height in steps; the strip inside is
          at full height from the start, so nothing reflows as it feeds. */}
      <div className="receipt-paper px-5">
        <div
          className={cn("receipt-feed", height !== null && "receipt-feed--run")}
          style={
            {
              "--receipt-height": height !== null ? `${height}px` : "0px",
              "--receipt-duration": `${(steps * 0.075).toFixed(2)}s`,
              animationTimingFunction: `steps(${steps}, end)`,
            } as React.CSSProperties
          }
        >
          <div ref={stripRef} className="receipt-strip px-5 py-6 shadow-xl">
            {model.lines.map((line, i) => (
              <PrintedLine key={i} line={line} index={i} />
            ))}
          </div>
        </div>
        <div className="receipt-tear shadow-xl" aria-hidden="true" />
      </div>

      {/* Actions live off the paper so the printout stays a clean document. */}
      <div className="mt-6 rounded-2xl border border-white/15 bg-[var(--color-card)] p-5">
        {status === "success" ? (
          <p className="flex items-center gap-3 text-sm text-white">
            <Check className="h-4 w-4 flex-none" aria-hidden="true" />
            Beleg an {email} gesendet.
          </p>
        ) : (
          <form onSubmit={onSend} className="space-y-3">
            <label htmlFor="receipt-email" className="u-kicker block">
              Beleg per E-Mail
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="receipt-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@adresse.de"
                className="w-full border-b border-[var(--color-input)] bg-transparent py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/50 transition-colors focus:border-[var(--color-foreground)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex min-h-11 flex-none items-center justify-center gap-2 rounded-full bg-[var(--color-foreground)] px-6 text-sm font-semibold text-[var(--color-background)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              >
                {status === "sending" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Mail className="h-4 w-4" aria-hidden="true" />
                )}
                Senden
              </button>
            </div>
            {status === "error" && (
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Konnte nicht gesendet werden. Schreib uns kurz an{" "}
                <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">
                  {SITE.email}
                </a>
                .
              </p>
            )}
          </form>
        )}
      </div>
    </Overlay>
  );
}
