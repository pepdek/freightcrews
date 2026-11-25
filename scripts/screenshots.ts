// Gate 6: screenshots of every page at 390/768/1440, plus automated checks for the usual layout faults.
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { ROOT, pages, report, serve } from "./shared.ts";

const out = join(ROOT, "screenshots");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const server = await serve();
const browser = await chromium.launch({ channel: "chrome" });
const issues: string[] = [];
let shots = 0;

for (const width of [390, 768, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const { path } of pages()) {
    const name = path.replace(/^\/|\/$|\.html$/g, "").replaceAll("/", "_") || "home";
    await page.goto(server.url + path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const faults = await page.evaluate(() => {
      const out: string[] = [];
      const page = document.documentElement;
      if (page.scrollWidth > page.clientWidth) out.push(`horizontal overflow: ${page.scrollWidth}px`);
      for (const el of document.querySelectorAll<HTMLElement>("main *, footer *, header *")) {
        if (el.closest(".marquee, .sr-only, .skip, svg.route, .compare thead") || el.querySelector(":scope > .sheet") || !el.checkVisibility() || !el.getClientRects().length) continue;
        const box = el.getBoundingClientRect();
        if (box.right > page.clientWidth + 1 || box.left < -1) out.push(`outside viewport: <${el.tagName.toLowerCase()} class="${el.getAttribute("class")}">`);
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX === "visible" && el.clientWidth > 0 && getComputedStyle(el).display !== "inline")
          out.push(`content wider than box: <${el.tagName.toLowerCase()}> "${el.textContent!.trim().slice(0, 50)}"`);
      }
      // A heading whose last line holds a single word.
      for (const heading of document.querySelectorAll("h1, h2, h3")) {
        if (!heading.checkVisibility()) continue;
        const lines = new Map<number, number>();
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          for (const word of node.textContent!.matchAll(/\S+/g)) {
            const range = document.createRange();
            range.setStart(node, word.index);
            range.setEnd(node, word.index + word[0].length);
            const rect = range.getClientRects()[0];
            if (!rect) continue;
            const line = [...lines.keys()].find((y) => Math.abs(y - rect.bottom) < rect.height / 2) ?? rect.bottom;
            lines.set(line, (lines.get(line) ?? 0) + 1);
          }
        }
        const counts = [...lines].sort((a, b) => a[0] - b[0]).map(([, n]) => n);
        if (counts.length > 1 && counts.at(-1) === 1) out.push(`orphan in ${heading.tagName}: "${heading.textContent!.replace(/\s+/g, " ").trim()}"`);
      }
      // §2.8: at most three type sizes per section (mono labels are labels, not a type level).
      for (const section of document.querySelectorAll("main section")) {
        const sizes = new Set<string>();
        for (const el of section.querySelectorAll<HTMLElement>("*")) {
          if (el.closest(".sr-only, svg, option, .portrait") || !el.checkVisibility() || !el.getClientRects().length) continue;
          if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim())) continue;
          const style = getComputedStyle(el);
          if (!style.fontFamily.includes("Mono")) sizes.add(style.fontSize);
        }
        if (sizes.size > 3) out.push(`${sizes.size} type sizes (${[...sizes].join(", ")}) in section "${section.querySelector("h1,h2")?.textContent?.trim().slice(0, 40)}"`);
      }
      return [...new Set(out)];
    });
    issues.push(...faults.map((f) => `${path} @${width}: ${f}`));
    await page.screenshot({ path: join(out, `${name}-${width}.png`), fullPage: true });
    shots++;
  }
  await page.goto(server.url + "/", { waitUntil: "networkidle" });
  await page.locator(width < 900 ? "[data-mobile-nav] > summary" : "[data-mega] > summary").click();
  await page.screenshot({ path: join(out, `menu-open-${width}.png`) });
  shots++;
  await context.close();
}

await browser.close();
server.close();
const summary = `screenshots: ${shots} saved to screenshots/, ${issues.length} automated layout findings`;
report("visual-checks.txt", [summary, "", "Checks: overflow, elements outside the viewport, single-word last lines in headings, >3 type sizes per section.", "", ...issues].join("\n"));
console.log(summary);
if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}
