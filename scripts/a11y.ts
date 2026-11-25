// Gate 3: zero axe-core violations on every page, closed and with the interactive states open.
import AxeBuilder from "@axe-core/playwright";
import { chromium, type Page } from "playwright";
import { pages, report, serve } from "./shared.ts";

const server = await serve();
const browser = await chromium.launch({ channel: "chrome" });
const found: { where: string; id: string; impact: string; help: string; nodes: string[] }[] = [];
let runs = 0;

async function check(page: Page, where: string) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  runs++;
  for (const v of violations)
    found.push({ where, id: v.id, impact: v.impact ?? "", help: v.help, nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5) });
}

for (const [label, viewport] of [["390", { width: 390, height: 844 }], ["1440", { width: 1440, height: 900 }]] as const) {
  // Reduced motion, so nothing is mid-fade (and therefore skipped) when axe measures contrast.
  const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const { path } of pages()) {
    await page.goto(server.url + path, { waitUntil: "networkidle" });
    await check(page, `${path} @${label}`);

    const details = page.locator("main details");
    if (await details.count()) {
      for (const summary of await page.locator("main details > summary").all()) await summary.click();
      await check(page, `${path} @${label} accordion open`);
    }
    if (await page.locator("form[data-form]").count()) {
      await page.locator("form[data-form] button[type=submit]").first().click();
      await check(page, `${path} @${label} form errors`);
    }
  }
  await page.goto(server.url + "/", { waitUntil: "networkidle" });
  await page.locator(label === "390" ? "[data-mobile-nav] > summary" : "[data-mega] > summary").click();
  await check(page, `/ @${label} menu open`);
  await context.close();
}

await browser.close();
server.close();
const summary = `axe-core: ${pages().length} pages, ${runs} runs (390px and 1440px, menus, accordions, form errors), ${found.length} violations`;
report("axe.json", JSON.stringify({ summary, violations: found }, null, 2));
console.log(summary);
if (found.length) {
  for (const f of found) console.error(`${f.where}: [${f.impact}] ${f.id} — ${f.help}\n    ${f.nodes.join("\n    ")}`);
  process.exit(1);
}
