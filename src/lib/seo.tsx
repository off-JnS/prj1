import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

/**
 * Lightweight, dependency-free SEO head manager for the SPA.
 *
 * Each route renders <Seo … /> once; the hook imperatively keeps the document
 * <head> in sync (title, description, canonical, Open Graph, Twitter Card).
 * Tags are looked up by a stable selector and mutated in place, so navigating
 * between routes never produces duplicates.
 */

export const SITE_URL = "https://prj1.de";
const SITE_NAME = "PRJ1";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SeoProps {
  /** Page title — rendered as `${title} — PRJ1` unless it already contains the brand. */
  title: string;
  description: string;
  /** Route path for the canonical/OG URL, e.g. "/portfolio". Defaults to current path. */
  path?: string;
  /** Absolute or root-relative OG image URL. */
  image?: string;
  /** Set true to keep the page out of search indexes (e.g. the 404 page). */
  noindex?: boolean;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSeo({ title, description, path, image, noindex }: SeoProps) {
  const location = useLocation();
  const resolvedPath = path ?? location.pathname;

  useLayoutEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    const url = `${SITE_URL}${resolvedPath === "/" ? "" : resolvedPath}` || SITE_URL;
    const ogImage = image
      ? image.startsWith("http")
        ? image
        : `${SITE_URL}${image}`
      : DEFAULT_OG_IMAGE;

    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertLink("canonical", url);

    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", "de_DE");
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", ogImage);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);
  }, [title, description, resolvedPath, image, noindex]);
}

export default function Seo(props: SeoProps) {
  useSeo(props);
  return null;
}

/**
 * Injects a JSON-LD structured-data block for the current route and removes
 * it on unmount, so navigating between pages never leaves stale schema.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify({ "@context": "https://schema.org", ...data });

  useLayoutEffect(() => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.text = json;
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, [json]);

  return null;
}
