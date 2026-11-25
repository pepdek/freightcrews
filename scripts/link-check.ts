// Gate 5: no broken internal links. Also enforces the §10 invariants that are easy to break by accident.
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { SITE } from "../src/config.ts";
import { DIST, pages, report } from "./shared.ts";

const all = pages();
const html = new Map(all.map((p) => [p.path, readFileSync(p.file, "utf8")]));
const errors: string[] = [];
const external = new Set<string>();
const seen = { title: new Map<string, string>(), description: new Map<string, string>() };
let links = 0;

for (const [path, source] of html) {
  const markup = source.replace(/<(style|script)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  for (const [, , raw] of markup.matchAll(/\s(href|src|action)="([^"]*)"/g)) {
    const link = raw!.replace(/&#38;|&amp;/g, "&");
    const url = new URL(link, new URL(path, SITE.DOMAIN));
    if (url.origin !== new URL(SITE.DOMAIN).origin) {
      external.add(link);
      continue;
    }
    links++;
    let target = join(DIST, url.pathname);
    if (url.pathname.endsWith("/")) target = join(target, "index.html");
    if (!existsSync(target) || !statSync(target).isFile()) errors.push(`${path}: broken link ${link}`);
    else if (url.hash && target.endsWith(".html") && !readFileSync(target, "utf8").includes(`id="${url.hash.slice(1)}"`))
      errors.push(`${path}: missing anchor ${link}`);
  }

  const title = source.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const description = source.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  for (const [kind, value] of [["title", title], ["description", description]] as const) {
    if (!value) errors.push(`${path}: no ${kind}`);
    else if (seen[kind].has(value)) errors.push(`${path}: ${kind} duplicates ${seen[kind].get(value)}`);
    seen[kind].set(value, path);
  }
  if (description.replace(/&#\d+;|&\w+;/g, "'").length >= 155) errors.push(`${path}: description is ${description.length} characters`);
  if (!source.includes('rel="canonical"') && !source.includes('content="noindex"')) errors.push(`${path}: no canonical`);

  const levels = [...markup.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  if (levels.filter((l) => l === 1).length !== 1) errors.push(`${path}: needs exactly one h1`);
  levels.reduce((previous, level) => {
    if (level > previous + 1) errors.push(`${path}: heading jumps from h${previous} to h${level}`);
    return level;
  }, 0);
}

const summary = `link-check: ${all.length} pages, ${links} internal links, ${errors.length} errors`;
report("link-check.txt", [summary, "", ...errors, "", "External links (not fetched):", ...[...external].sort().map((l) => `  ${l}`)].join("\n"));
console.log(summary);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
