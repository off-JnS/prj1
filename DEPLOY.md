# PRJ1 — Deployment auf Hostinger

Die Website ist eine Vite/React-SPA. Der Build landet in `dist/` und wird
per GitHub Actions automatisch auf Hostinger hochgeladen.

## Einmalige Einrichtung

1. **Repo auf GitHub pushen** (Branch `main`).
2. **FTP-Zugang in Hostinger anlegen**: hPanel → *Files → FTP Accounts*.
   Host (z. B. `ftp.prj1.de`), Benutzer und Passwort notieren.
3. **GitHub Secrets setzen**: Repo → *Settings → Secrets and variables →
   Actions* → drei Secrets anlegen:
   - `FTP_SERVER`
   - `FTP_USERNAME`
   - `FTP_PASSWORD`
4. Fertig — jeder Push auf `main` baut und deployt automatisch
   (Workflow: `.github/workflows/deploy.yml`).

## Wichtig auf Hostinger

- `public/.htaccess` wird mit ins `dist/` kopiert und sorgt für das
  SPA-Routing (`/portfolio`, `/preise`, … funktionieren bei Direktaufruf)
  sowie Caching/Security-Header.
- **Force HTTPS** im hPanel aktivieren (oder den auskommentierten Block in
  der `.htaccess` einkommentieren — nicht beides).

## Was später noch einzutragen ist

| Was | Wo |
|---|---|
| Stripe Payment Links (pro Paket, monatlich + jährlich) | `src/data/plans.ts` → `paymentLinkMonthly` / `paymentLinkYearly` |
| Web3Forms Access Key (Kontaktformular) | `src/config/site.ts` → `web3formsKey` (kostenlos: https://web3forms.com) |
| Video-Testimonial | Datei nach `public/testimonials/prj1.mp4` legen |

Solange die Stripe-Links leer sind, öffnen die Paket-Buttons eine
vorausgefüllte E-Mail. Solange der Web3Forms-Key fehlt, öffnet das
Kontaktformular das E-Mail-Programm mit allen Formulardaten.

## Lokal arbeiten

```bash
npm install
npm run dev       # Entwicklung auf http://localhost:5173
npm run build     # Produktions-Build nach dist/
npm run preview   # Build lokal testen
```
