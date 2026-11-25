// Gate 2: Lighthouse (mobile) on home, pricing and one agent page. Median of three runs per page.
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import { report, serve } from "./shared.ts";

const targets = { home: "/", pricing: "/pricing/", agent: "/agents/quote-replies/" };
const minimum = { performance: 95, accessibility: 100, "best-practices": 100, seo: 100 };
const keys = Object.keys(minimum) as (keyof typeof minimum)[];

const server = await serve();
const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--no-first-run"] });
const table = ["| Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- |"];
const failures: string[] = [];
let version = "";

try {
  for (const [name, path] of Object.entries(targets)) {
    const runs = [];
    for (let i = 0; i < 3; i++) {
      const result = await lighthouse(server.url + path, { port: chrome.port, output: "html", onlyCategories: keys, logLevel: "error" });
      runs.push(result!);
    }
    runs.sort((a, b) => a.lhr.categories.performance!.score! - b.lhr.categories.performance!.score!);
    const { lhr, report: html } = runs[1]!;
    version = lhr.lighthouseVersion;
    report(`lighthouse-${name}.html`, html as string);
    const scores = keys.map((k) => Math.round(lhr.categories[k]!.score! * 100));
    const metric = (id: string) => lhr.audits[id]!.displayValue!.replace(/ /g, " ");
    table.push(`| ${path} | ${scores.join(" | ")} | ${["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift"].map(metric).join(" | ")} |`);
    keys.forEach((k, i) => {
      if (scores[i]! < minimum[k]) {
        const bad = lhr.categories[k]!.auditRefs.filter((r) => r.weight > 0 && (lhr.audits[r.id]!.score ?? 1) < 0.9).map((r) => r.id);
        failures.push(`${path}: ${k} ${scores[i]} < ${minimum[k]} (${bad.join(", ")})`);
      }
    });
  }
} finally {
  chrome.kill();
  server.close();
}

const summary = `lighthouse ${version} (mobile): ${Object.keys(targets).length} pages, ${failures.length} scores below target`;
report("lighthouse.md", [summary, "", ...table, "", "Measured against a local gzip server, median of 3 runs. Re-check on the live Netlify URL after deploy.", ...failures].join("\n"));
console.log([summary, ...table, ...failures].join("\n"));
if (failures.length) process.exit(1);
