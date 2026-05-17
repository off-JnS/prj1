import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/previews");
mkdirSync(outDir, { recursive: true });

const sites = [
  { name: "ehsos-burger", url: "https://ehsos-burger.de" },
  { name: "beispiel-cafe", url: "https://cafeliteraritat.netlify.app/" },
  { name: "prj1", url: "https://prj1.de" },
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

for (const site of sites) {
  console.log(`Capturing ${site.name}...`);
  try {
    await page.goto(site.url, { waitUntil: "networkidle", timeout: 20000 });
    await page.screenshot({
      path: join(outDir, `${site.name}.jpg`),
      type: "jpeg",
      quality: 90,
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
    console.log(`  ✓ Saved ${site.name}.jpg`);
  } catch (e) {
    console.warn(`  ✗ Failed: ${e.message}`);
  }
}

await browser.close();
console.log("Done.");
