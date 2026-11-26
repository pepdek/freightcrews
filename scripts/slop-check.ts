// Gate 4: banned words (brief §2.4 and §11.4) and emoji in the built HTML. Any hit fails the build.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, pages, report } from "./shared.ts";

const BANNED = [
  "unlock\\w*", "supercharg\\w*", "revolutioni[sz]\\w*", "seamless(ly)?", "cutting[- ]edge", "game[- ]?chang\\w*",
  "leverag(e|es|ed|ing)", "harness\\w*", "empower\\w*", "synerg\\w*", "next[- ]level", "delv(e|es|ed|ing)", "elevat(e|es|ed|ing)",
  "robust\\w*", "in today[’'‘]s fast[- ]paced world", "AI[- ]powered", "transform your business",
  "lorem", "TBD", "XYZ", "placeholder", "coming soon", "example\\.com",
];
const pattern = new RegExp(`\\b(${BANNED.join("|")})\\b|(?![©®™])\\p{Extended_Pictographic}`, "giu");

// <style> blocks are CSS, not copy (Tailwind's reset names the ::placeholder selector).
const clean = (html: string) =>
  html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/&#(39|x27);|&apos;/gi, "'").replace(/&nbsp;/g, " ");

// Self-check: the pattern must catch what it claims to, and leave honest copy alone.
for (const bad of ["Seamlessly", "AI-powered", "Coming soon", "in today&#39;s fast-paced world", "user@example.com", "\u{1F680}"])
  assert.match(clean(bad), new RegExp(pattern.source, "iu"), `slop-check misses: ${bad}`);
assert.equal(clean("© 2026 An agent that drafts. See all agents →").match(pattern), null);

const all = pages();
const hits = all.flatMap(({ file, path }) =>
  [...clean(readFileSync(file, "utf8")).matchAll(pattern)].map(
    (m) => `${path}: "${m[0]}" … ${m.input.slice(Math.max(0, m.index - 60), m.index + 60).replace(/\s+/g, " ")}`,
  ),
);
// Every "Who we help" page must be its own: no sentence may appear in two role files.
const roleDir = join(ROOT, "src/content/roles");
const owner = new Map<string, string>();
for (const file of readdirSync(roleDir)) {
  const strings = readFileSync(join(roleDir, file), "utf8").matchAll(/"([^"]{40,})"/g);
  for (const [, text] of strings)
    for (const sentence of text!.split(/(?<=[.?!])\s+/).filter((s) => s.length >= 40)) {
      const first = owner.get(sentence.toLowerCase());
      if (first && first !== file) hits.push(`duplicate copy in ${first} and ${file}: "${sentence}"`);
      owner.set(sentence.toLowerCase(), file);
    }
}

const summary = `slop-check: ${all.length} pages, ${BANNED.length} banned terms + emoji, ${owner.size} role sentences compared, ${hits.length} hits`;
report("slop-check.txt", [summary, "", ...BANNED.map((b) => `  checked: ${b}`), "", ...hits].join("\n"));
console.log(summary);
if (hits.length) {
  console.error(hits.join("\n"));
  process.exit(1);
}
