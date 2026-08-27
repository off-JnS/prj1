import { SITE } from "@/config/site";
import {
  VAT_RATE,
  discountedPrice,
  effectiveTier,
  type DiscountTier,
  type Plan,
} from "@/data/plans";

/** Character width of the printed strip — also the wrap width of the e-mail. */
export const RECEIPT_WIDTH = 34;

export type ReceiptLine =
  | { kind: "center"; text: string; strong?: boolean }
  | { kind: "kv"; label: string; value: string; strong?: boolean }
  | { kind: "text"; text: string }
  | { kind: "rule" }
  | { kind: "double-rule" }
  | { kind: "gap" };

export interface ReceiptModel {
  number: string;
  date: string;
  plan: Plan;
  tier: DiscountTier;
  /** List price before any discount, net. */
  listNet: number;
  /** Absolute discount in EUR, net. */
  discountAmount: number;
  /** Net after discount. */
  net: number;
  vat: number;
  gross: number;
  recurring: boolean;
  lines: ReceiptLine[];
}

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const eur0 = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
});

/**
 * Stable pseudo-receipt number.
 *
 * Derived from the plan, tier and calendar day rather than randomised, so a
 * reload or a re-send shows the same number instead of implying a second
 * purchase. It is a reference for correspondence — the real, sequential
 * invoice number comes from Stripe.
 */
function receiptNumber(plan: Plan, tier: DiscountTier, now: Date): string {
  const seed = `${plan.id}:${tier}:${now.toISOString().slice(0, 10)}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const day = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `${day}-${String(hash % 10000).padStart(4, "0")}`;
}

/**
 * Builds the receipt once, for both the on-screen printout and the e-mail —
 * the two can't drift apart because they are the same object.
 */
export function buildReceipt(plan: Plan, tier: DiscountTier, now = new Date()): ReceiptModel {
  const applied = effectiveTier(plan, tier);
  const listNet = plan.price;
  const net = discountedPrice(listNet, applied);
  const discountAmount = listNet - net;
  const vat = Math.round(net * VAT_RATE * 100) / 100;
  const gross = Math.round((net + vat) * 100) / 100;
  const recurring = plan.billing === "monthly";

  const date = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(now);
  const time = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  const number = receiptNumber(plan, applied, now);

  const lines: ReceiptLine[] = [
    { kind: "center", text: SITE.name, strong: true },
    { kind: "center", text: SITE.claim },
    { kind: "gap" },
    { kind: "center", text: `${SITE.address.street}` },
    { kind: "center", text: `${SITE.address.zip} ${SITE.address.city}` },
    { kind: "rule" },
    { kind: "kv", label: "Beleg-Nr.", value: number },
    { kind: "kv", label: "Datum", value: `${date} ${time}` },
    { kind: "rule" },
    { kind: "center", text: "Position" },
    { kind: "gap" },
    {
      kind: "kv",
      label: `1 × ${plan.name}`,
      value: recurring ? `${eur0.format(listNet)}/Mon.` : eur0.format(listNet),
      strong: true,
    },
  ];

  for (const feature of plan.features) {
    lines.push({ kind: "text", text: `  · ${feature}` });
  }

  lines.push({ kind: "rule" });
  lines.push({ kind: "kv", label: "Zwischensumme", value: eur.format(listNet) });

  if (discountAmount > 0) {
    lines.push({
      kind: "kv",
      label: `Rabatt ${applied} %`,
      value: `−${eur.format(discountAmount)}`,
    });
    lines.push({ kind: "kv", label: "Netto", value: eur.format(net) });
  }

  lines.push({ kind: "kv", label: `MwSt. ${Math.round(VAT_RATE * 100)} %`, value: eur.format(vat) });
  lines.push({ kind: "double-rule" });
  lines.push({
    kind: "kv",
    label: recurring ? "Summe / Monat" : "Gesamt",
    value: eur.format(gross),
    strong: true,
  });
  lines.push({ kind: "rule" });
  lines.push({ kind: "kv", label: "Zahlart", value: "Stripe" });
  lines.push({ kind: "kv", label: "Status", value: "Bezahlt" });
  lines.push({ kind: "rule" });
  lines.push({ kind: "text", text: "BELEG — KEINE RECHNUNG." });
  lines.push({
    kind: "text",
    text: "Die offizielle Rechnung erhältst du per E-Mail direkt von Stripe.",
  });
  lines.push({ kind: "gap" });
  lines.push({ kind: "center", text: "Vielen Dank." });
  lines.push({ kind: "center", text: "* * *" });

  return {
    number,
    date,
    plan,
    tier: applied,
    listNet,
    discountAmount,
    net,
    vat,
    gross,
    recurring,
    lines,
  };
}

/** Wraps a paragraph to the strip width, so the e-mail keeps the same shape. */
function wrap(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > width) {
      out.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) out.push(line);
  return out;
}

/** Monospace rendering of the receipt — the body of the "send to e-mail". */
export function receiptToText(model: ReceiptModel): string {
  const w = RECEIPT_WIDTH;
  const out: string[] = [];

  for (const line of model.lines) {
    switch (line.kind) {
      case "rule":
        out.push("-".repeat(w));
        break;
      case "double-rule":
        out.push("=".repeat(w));
        break;
      case "gap":
        out.push("");
        break;
      case "center": {
        const text = line.strong ? line.text.toUpperCase() : line.text;
        const pad = Math.max(0, Math.floor((w - text.length) / 2));
        out.push(" ".repeat(pad) + text);
        break;
      }
      case "kv": {
        const gap = Math.max(1, w - line.label.length - line.value.length);
        out.push(line.label + " ".repeat(gap) + line.value);
        break;
      }
      case "text":
        out.push(...wrap(line.text, w));
        break;
    }
  }

  return out.join("\n");
}
