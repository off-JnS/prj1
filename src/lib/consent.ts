import { SITE } from "@/config/site";

/**
 * Minimal DSGVO consent handling. Google Analytics is loaded only after the
 * visitor explicitly accepts — nothing is injected before that.
 */

const STORAGE_KEY = "prj1:consent";

export type Consent = "granted" | "denied" | null;

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Exclude<Consent, null>) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable (private mode) — consent simply isn't persisted */
  }
  if (value === "granted") loadAnalytics();
}

/**
 * Clears the stored decision so the banner shows again (used on /datenschutz)
 * and deletes Google Analytics' `_ga*` cookies — revoking consent must also
 * remove what was set under it.
 */
export function resetConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  const host = window.location.hostname;
  // GA sets its cookies on the registrable domain (".example.de"), so try
  // the bare host and each parent domain.
  const domains = ["", ...host.split(".").map((_, i, parts) => "." + parts.slice(i).join("."))];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

let analyticsLoaded = false;

export function loadAnalytics() {
  if (analyticsLoaded || !SITE.gaId || import.meta.env.DEV) return;
  analyticsLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`;
  document.head.appendChild(script);

  const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer.push(args);
  };
  w.gtag("js", new Date());
  w.gtag("config", SITE.gaId, { anonymize_ip: true });
}
