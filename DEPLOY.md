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
| Stripe Publishable Key (`pk_live_…`) | `src/config/site.ts` → `stripePublishableKey` |
| Stripe Buy Button IDs (pro Paket, pro Rabattstufe) | `src/data/plans.ts` → `stripe.buyButtonId` |
| Stripe Payment Links (Alternative zu Buy Buttons) | `src/data/plans.ts` → `stripe.paymentLink` |
| Web3Forms Access Key (Kontaktformular **und** Beleg-Versand) | `src/config/site.ts` → `web3formsKey` (kostenlos: https://web3forms.com) |
| Video-Testimonial | Datei nach `public/testimonials/prj1.mp4` legen |

Solange die Stripe-Werte leer sind, öffnen die Paket-Buttons eine
vorausgefüllte E-Mail — die Karten sehen unverändert aus. Solange der
Web3Forms-Key fehlt, öffnen Kontaktformular und Beleg-Versand das
E-Mail-Programm mit allen Daten.

## Stripe einrichten

### 1. Rabattstufen

Das Blackjack-Spiel auf `/preise` vergibt 10 % oder 20 % Rabatt auf die
**einmaligen Website-Pakete** (Wartungspakete sind ausgenommen). Ein
rabattierter Checkout ist in Stripe ein *eigenes* Objekt — deshalb wird pro
Paket und pro Stufe ein eigener Buy Button bzw. Payment Link hinterlegt:

```ts
// src/data/plans.ts
{
  id: "professional",
  // …
  stripe: {
    buyButtonId: {
      0:  "buy_btn_…",   // Vollpreis   1.750 €
      10: "buy_btn_…",   // −10 %       1.575 €
      20: "buy_btn_…",   // −20 %       1.400 €
    },
  },
}
```

Fehlt eine Stufe, fällt die Seite automatisch auf die Vollpreis-Variante
zurück, danach auf den Payment Link, zuletzt auf eine vorausgefüllte E-Mail.

### 2. Success-URL — steuert den gedruckten Beleg

Bei **jedem** Buy Button muss im Stripe-Dashboard unter *After payment →
Confirmation page → Redirect to a page* diese URL eingetragen werden:

```
https://prj1.de/preise?beleg=<paket-id>&rabatt=<0|10|20>
```

`<paket-id>` ist das `id`-Feld aus `src/data/plans.ts`
(`starter`, `professional`, `premium`, `care-basic`, `care-standard`,
`care-premium`). Beispiel für Professional mit 10 % Rabatt:

```
https://prj1.de/preise?beleg=professional&rabatt=10
```

Diese Parameter lösen die Druck-Animation des Belegs aus.

> **Wichtig:** Der Beleg ist bewusst als *Beleg* und nicht als Rechnung
> ausgezeichnet. Ohne Backend ist die Rückkehr-URL nur ein Parameter — sie
> beweist keine Zahlung und darf deshalb kein Rechnungsdokument sein. Die
> echte, fortlaufend nummerierte Rechnung verschickt Stripe selbst per
> E-Mail. Diesen Hinweis auf dem Beleg bitte nicht entfernen.

### 3. Test

Nach dem Eintragen der Werte lässt sich der Beleg jederzeit ohne Zahlung
prüfen, indem die Success-URL direkt aufgerufen wird.

## Lokal arbeiten

```bash
npm install
npm run dev       # Entwicklung auf http://localhost:5173
npm run build     # Produktions-Build nach dist/
npm run preview   # Build lokal testen
```
