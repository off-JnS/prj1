import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-[var(--color-border)] bg-[var(--color-background)] px-6 py-16 sm:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <img
            src="/logo/PRJ1-White.png"
            alt="PRJ1"
            className="h-8 w-auto"
            draggable={false}
          />
          <p className="mt-3 max-w-sm text-sm text-[var(--color-muted-foreground)]">
            Webdesign auf Award-Niveau. Pixel für Pixel — schwarz und weiß.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-foreground)]">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
            <li><Link className="hover:text-[var(--color-foreground)]" to="/">Start</Link></li>
            <li><Link className="hover:text-[var(--color-foreground)]" to="/portfolio">Portfolio</Link></li>
            <li><Link className="hover:text-[var(--color-foreground)]" to="/pricing">Preise</Link></li>
            <li><Link className="hover:text-[var(--color-foreground)]" to="/impressum">Impressum</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-foreground)]">
            Kontakt
          </h4>
          <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
            <li><a className="hover:text-[var(--color-foreground)]" href="mailto:hello@prj1.studio">hello@prj1.studio</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-start justify-between gap-2 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-muted-foreground)] sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} PRJ1. Alle Rechte vorbehalten.</span>
        <span>Mit Bedacht gestaltet.</span>
      </div>
    </footer>
  );
}
