// Gates 7 (reduced motion), 8 (no JS) and 9 (page weight), plus the four interactions with motion on.
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium, type Browser, type BrowserContextOptions, type Page } from "playwright";
import { ROOT, pages, report, serve } from "./shared.ts";

const server = await serve();
const browser: Browser = await chromium.launch({ channel: "chrome" });
const lines: string[] = [];
let failed = 0;
let total = 0;

async function test(name: string, options: BrowserContextOptions, body: (page: Page) => Promise<string | void>) {
  total++;
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  try {
    const note = await body(page);
    assert.deepEqual(errors, [], "console errors");
    lines.push(`PASS  ${name}${note ? `: ${note}` : ""}`);
  } catch (e) {
    failed++;
    lines.push(`FAIL  ${name}: ${(e as Error).message}`);
  }
  await context.close();
}

const go = (page: Page, path: string) => page.goto(server.url + path, { waitUntil: "networkidle" });
const mobile = { width: 390, height: 844 };
const reduced = { reducedMotion: "reduce" as const };
const noJs = { javaScriptEnabled: false };

/* ---------- Gate 7: reduced motion ---------- */
await test("reduced motion: nothing animates on any page", reduced, async (page) => {
  for (const { path } of pages()) {
    await go(page, path);
    const state = await page.evaluate(() => ({
      running: document.getAnimations().length,
      transitions: [...document.querySelectorAll("*")].filter((el) =>
        [getComputedStyle(el), getComputedStyle(el, "::after")].some((s) => parseFloat(s.transitionDuration) > 0 || s.animationName !== "none"),
      ).length,
      hidden: document.querySelectorAll(".reveal").length,
    }));
    assert.deepEqual(state, { running: 0, transitions: 0, hidden: 0 }, path);
  }
  return `${pages().length} pages, 0 animations, 0 transitions`;
});
await test("reduced motion: widget shows its final state at once, no Replay", reduced, async (page) => {
  await go(page, "/");
  assert.equal(await page.locator("[data-count]").textContent(), "12.0");
  assert.equal(await page.locator("[data-status]", { hasText: "Done" }).count(), 5);
  assert.equal(await page.locator("[data-replay]").isVisible(), false);
});

/* ---------- The four interactions, motion on ---------- */
await test("hero route draws once over 1.6s", {}, async (page) => {
  await page.goto(server.url + "/");
  const timing = await page.locator(".route path").evaluate((el) => {
    const s = getComputedStyle(el);
    return [s.animationName.includes("draw"), s.animationDuration, s.animationIterationCount];
  });
  assert.deepEqual(timing, [true, "1.6s", "1"]);
});
await test("widget: waits, counts up row by row on scroll, replays", { viewport: { width: 1440, height: 600 } }, async (page) => {
  await go(page, "/");
  const count = page.locator("[data-count]");
  assert.equal(await count.textContent(), "0.0");
  assert.equal(await page.locator("[data-status]", { hasText: "Waiting" }).count(), 5);
  await page.locator("[data-desk]").scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(1250);
  assert.equal(await count.textContent(), "4.5");
  assert.equal(await page.locator("[data-status]", { hasText: "Done" }).count(), 1);
  await page.waitForTimeout(3000);
  assert.equal(await count.textContent(), "12.0");
  await page.locator("[data-replay]").click();
  assert.equal(await count.textContent(), "0.0");
  await page.waitForTimeout(4200);
  assert.equal(await count.textContent(), "12.0");
});
await test("marquee: 40s loop, pauses on hover, hidden from assistive tech", {}, async (page) => {
  await go(page, "/");
  const track = page.locator(".marquee .track");
  assert.equal(await track.evaluate((el) => getComputedStyle(el).animationDuration), "40s");
  await page.locator(".marquee").hover();
  assert.equal(await track.evaluate((el) => getComputedStyle(el).animationPlayState), "paused");
  assert.equal(await page.locator(".marquee").getAttribute("aria-hidden"), "true");
});
await test("FAQ opens from the keyboard", {}, async (page) => {
  await go(page, "/pricing/");
  await page.locator(".faq summary").first().focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".faq details").first().getAttribute("open"), "");
});
await test("scroll reveal: below-the-fold sections appear once scrolled to", {}, async (page) => {
  await go(page, "/");
  assert.ok((await page.locator("main > section.reveal").count()) > 3);
  for (let y = 0; y < 12000; y += 600) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(600);
  assert.equal(await page.locator("main > section.reveal").count(), 0);
});
await test("mega menu: opens on keyboard focus and click, closes on Escape and outside click", {}, async (page) => {
  await go(page, "/");
  const menu = page.locator("[data-mega]");
  const isOpen = () => menu.evaluate((el: HTMLDetailsElement) => el.open);
  await page.locator(".desktop > a").first().focus();
  await page.keyboard.press("Tab");
  assert.equal(await isOpen(), true, "focus");
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement?.textContent), "Freight brokers");
  await page.keyboard.press("Escape");
  assert.equal(await isOpen(), false, "escape");
  await menu.locator("summary").click();
  assert.equal(await isOpen(), true, "click");
  await page.mouse.click(20, 600);
  assert.equal(await isOpen(), false, "outside click");
});
await test("mobile sheet: full screen, button pinned at the bottom, page inert behind it", { viewport: mobile }, async (page) => {
  await go(page, "/");
  await page.locator("[data-mobile-nav] > summary").click();
  const sheet = (await page.locator(".sheet").boundingBox())!;
  assert.deepEqual([sheet.x, sheet.y, sheet.width, sheet.height], [0, 64, 390, 780]);
  const cta = (await page.locator(".sheet-cta .btn").boundingBox())!;
  assert.ok(cta.y + cta.height <= 844 && cta.y > 740, `button at ${cta.y}`);
  assert.equal(await page.locator("main").getAttribute("inert"), "");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".sheet").isVisible(), false);
});
await test("forms: inline errors, focus on the first one, cleared on typing", {}, async (page) => {
  await go(page, "/teardown/");
  await page.getByRole("button", { name: "Request my teardown" }).click();
  assert.equal(await page.locator(".error:visible").count(), 4);
  assert.equal(await page.evaluate(() => document.activeElement?.id), "f-name");
  await page.locator("#f-name").fill("A");
  assert.equal(await page.locator(".error:visible").count(), 3);
});
await test("list form carries the business type to /thanks/ and its list link", {}, async (page) => {
  await go(page, "/50-jobs/");
  await page.locator("#f-first-name").fill("Test");
  await page.locator("#f-email").fill("test@freight.test");
  await page.locator("#f-business-type").selectOption("freight-agents");
  const [request] = await Promise.all([page.waitForRequest((r) => r.method() === "POST"), page.getByRole("button", { name: "Send me the list" }).click()]);
  const url = new URL(request.url());
  assert.equal(url.pathname + url.search, "/thanks/?form=list&niche=freight-agents");
  await page.waitForLoadState();
  await go(page, "/thanks/?form=list&niche=freight-agents");
  assert.equal(await page.getByRole("heading", { level: 1 }).innerText(), "Your list is\nready.");
  assert.equal(await page.getByRole("link", { name: "Open the list" }).getAttribute("href"), "/claude-use-cases/freight-agents/");
  await go(page, "/thanks/?form=list&niche=//evil.test");
  assert.equal(await page.getByRole("link", { name: "Open the list" }).getAttribute("href"), "/claude-use-cases/");
});

/* ---------- Gate 8: no JavaScript ---------- */
await test("no JS: all content visible on every page", noJs, async (page) => {
  for (const { path } of pages()) {
    await go(page, path);
    const invisible = await page.locator("main > section").evaluateAll((all) => all.filter((s) => getComputedStyle(s).opacity !== "1").length);
    assert.equal(invisible, 0, path);
  }
  await go(page, "/");
  assert.equal(await page.locator("[data-count]").textContent(), "12.0");
  assert.equal(await page.locator("[data-replay]").isVisible(), false);
});
await test("no JS: mega menu opens", noJs, async (page) => {
  await go(page, "/");
  await page.locator("[data-mega] > summary").click();
  await page.locator("[data-mega]").getByRole("link", { name: "Drayage" }).click();
  assert.equal(new URL(page.url()).pathname, "/claude-use-cases/drayage/");
});
await test("no JS: mobile menu opens and navigates", { ...noJs, viewport: mobile }, async (page) => {
  await go(page, "/");
  await page.locator("[data-mobile-nav] > summary").click();
  await page.locator(".sheet").getByRole("link", { name: "Pricing" }).click();
  assert.equal(new URL(page.url()).pathname, "/pricing/");
});
await test("no JS: teardown form submits every field and shows its message", noJs, async (page) => {
  await go(page, "/teardown/");
  for (const [id, value] of [["name", "Test"], ["company", "Test Co"], ["email", "test@freight.test"]]) await page.locator(`#f-${id}`).fill(value!);
  await page.locator("#f-business-type").selectOption("3PL");
  const [request] = await Promise.all([page.waitForRequest((r) => r.method() === "POST"), page.getByRole("button", { name: "Request my teardown" }).click()]);
  const body = new URLSearchParams(request.postData()!);
  assert.deepEqual([...body.keys()], ["form-name", "source", "bot-field", "name", "company", "role", "email", "phone", "business-type", "team-size", "system", "time-sink"]);
  assert.equal(body.get("form-name"), "teardown");
  assert.equal(body.get("source"), "/teardown/");
  await page.waitForLoadState();
  assert.equal(await page.getByRole("heading", { level: 1 }).innerText(), "Got it.\nTalk soon.");
});
await test("no JS: list form submits and shows the list message", noJs, async (page) => {
  await go(page, "/claude-use-cases/drayage/");
  await page.locator("#f-first-name").fill("Test");
  await page.locator("#f-email").fill("test@freight.test");
  const [request] = await Promise.all([page.waitForRequest((r) => r.method() === "POST"), page.getByRole("button", { name: "Send me the list" }).click()]);
  const body = new URLSearchParams(request.postData()!);
  assert.deepEqual([...body.keys()], ["form-name", "source", "bot-field", "first-name", "email", "business-type"]);
  assert.equal(new URL(request.url()).search, "?form=list&niche=drayage");
  await page.waitForLoadState();
  assert.equal(await page.getByRole("heading", { level: 1 }).innerText(), "Your list is\nready.");
  assert.equal(await page.getByRole("link", { name: "Open the list" }).isVisible(), true);
});

/* ---------- Print: the niche page is "the list" ---------- */
await test("print: niche pages print as a short list", reduced, async (page) => {
  mkdirSync(join(ROOT, "screenshots"), { recursive: true });
  const counts: string[] = [];
  for (const slug of ["freight-brokers", "freight-agents", "drayage"]) {
    await go(page, `/claude-use-cases/${slug}/`);
    const pdf = await page.pdf({ path: join(ROOT, "screenshots", `print-${slug}.pdf`), format: "Letter", printBackground: true });
    const sheets = pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)?.length ?? 0;
    assert.ok(sheets >= 1 && sheets <= 2, `${slug} prints on ${sheets} pages`);
    await page.emulateMedia({ media: "print" });
    for (const selector of ["header", "footer", "form", ".night"]) assert.equal(await page.locator(selector).first().isVisible(), false, `${selector} prints`);
    await page.emulateMedia({ media: null }); // "screen" would stick and be used by the next pdf()
    counts.push(`${slug} ${sheets}p`);
  }
  return counts.join(", ");
});

/* ---------- Gate 9: page weight ---------- */
await test("home transfers under 250 KB, excluding fonts", {}, async (page) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  const files = new Map<string, { url: string; type: string; bytes: number }>();
  cdp.on("Network.responseReceived", (e) => files.set(e.requestId, { url: e.response.url, type: e.type, bytes: 0 }));
  cdp.on("Network.loadingFinished", (e) => { const f = files.get(e.requestId); if (f) f.bytes = e.encodedDataLength; });
  await go(page, "/");
  for (let y = 0; y < 12000; y += 900) await page.mouse.wheel(0, 900);
  await page.waitForTimeout(500);
  const kb = (list: { bytes: number }[]) => (list.reduce((n, f) => n + f.bytes, 0) / 1024).toFixed(1);
  const fonts = [...files.values()].filter((f) => f.type === "Font");
  const rest = [...files.values()].filter((f) => f.type !== "Font");
  assert.ok(Number(kb(rest)) < 250);
  return `${kb(rest)} KB in ${rest.length} requests (gzip), plus ${kb(fonts)} KB in ${fonts.length} font files`;
});

await browser.close();
server.close();
const summary = `behaviour: ${total - failed}/${total} checks passed`;
report("behaviour.txt", [summary, "", ...lines].join("\n"));
console.log([summary, ...lines].join("\n"));
if (failed) process.exit(1);
