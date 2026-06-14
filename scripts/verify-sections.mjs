/* Scroll through the landing page and capture viewport shots per section,
 * plus key sections of other pages. Also writes public/og-image.jpg.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:4173";
const OUT = "/tmp/prj1-shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function sectionSweep(width, height, label) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  // dismiss consent banner so it doesn't cover every shot
  const reject = page.getByRole("button", { name: "Ablehnen" });
  if (await reject.isVisible().catch(() => false)) await reject.click();

  const ids = ["hero", "leistungen", "arbeiten", "manifest", "prozess"];
  for (const id of ids) {
    await page.evaluate((sel) => {
      document.getElementById(sel)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, id);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}/sec-${id}-${label}.png` });
  }
  // footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/sec-footer-${label}.png` });
  await ctx.close();
  console.log(`sections done ${label}`);
}

await sectionSweep(1440, 900, "desktop");
await sectionSweep(375, 812, "mobile");

// OG image
const ogCtx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
const ogPage = await ogCtx.newPage();
await ogPage.goto(BASE + "/", { waitUntil: "networkidle" });
await ogPage.waitForTimeout(4000);
await ogPage.addStyleTag({ content: "header,nav,.grain-overlay,[role=dialog]{display:none !important}" });
await ogPage.waitForTimeout(300);
await ogPage.screenshot({ path: "public/og-image.jpg", type: "jpeg", quality: 88 });
console.log("og-image written");
await ogCtx.close();

await browser.close();
