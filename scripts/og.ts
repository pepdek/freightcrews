// Renders public/og.png (1200x630) from the self-hosted fonts. Run: node scripts/og.ts
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const font = (path: string) =>
  `url(data:font/woff2;base64,${readFileSync(new URL(`../node_modules/${path}`, import.meta.url)).toString("base64")})`;

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: IS; src: ${font("@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2")}; }
@font-face { font-family: IS; font-style: italic; src: ${font("@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2")}; }
@font-face { font-family: Inter; font-weight: 100 900; src: ${font("@fontsource-variable/inter/files/inter-latin-wght-normal.woff2")}; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #f5f2eb; color: #16181a; padding: 72px 80px; position: relative; overflow: hidden; }
.mark { display: flex; align-items: center; gap: 16px; font: 600 30px/1 Inter; }
.mark i { width: 18px; height: 18px; background: #d9531e; }
h1 { font: 400 100px/1.02 IS; letter-spacing: -0.01em; margin-top: 84px; max-width: 900px; text-wrap: balance; }
em { display: block; }
svg { position: absolute; left: 0; bottom: 34px; }
</style>
<div class="mark"><i></i>FreightCrews</div>
<h1>AI agents for small freight brokerages. <em>Yours to keep.</em></h1>
<svg width="1200" height="140" viewBox="0 0 1200 140"><path fill="none" stroke="#dad3c4" stroke-width="2.5" stroke-linejoin="round" d="M-10 112 L58 108 L104 96 L171 99 L226 83 L262 62 L338 58 L391 71 L452 74 L497 94 L566 101 L641 92 L688 96 L742 79 L797 52 L861 48 L903 57 L974 53 L1022 34 L1094 38 L1139 24 L1210 20"/></svg>`;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: new URL("../public/og.png", import.meta.url).pathname });
await browser.close();
console.log("public/og.png written");
