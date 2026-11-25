// Runs every §11 gate in order, saves output to reports/, and writes reports/summary.md.
import { spawnSync } from "node:child_process";
import { ROOT, report } from "./shared.ts";

const run = (command: string, args: string[]) => {
  const r = spawnSync(command, args, { cwd: ROOT, encoding: "utf8", env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1", NO_COLOR: "1", FORCE_COLOR: "0" } });
  const output = `${r.stdout}${r.stderr}`.replace(/\x1b\[[0-9;]*m/g, "").replaceAll(ROOT, "./").replaceAll(ROOT.slice(0, -1), ".").replace(/^\d\d:\d\d:\d\d /gm, "");
  process.stdout.write(output);
  return { ok: r.status === 0, output };
};
const results: { gate: string; ok: boolean; detail: string }[] = [];
const line = (output: string, pattern: RegExp) => output.match(pattern)?.[0] ?? "see report";

const build = run("npm", ["run", "build"]);
report("build.log", build.output);
const warnings = build.output.split("\n").filter((l) => /\bwarn(ing)?\b|deprecat/i.test(l)).length;
results.push({ gate: "1. Build", ok: build.ok && warnings === 0, detail: `${line(build.output, /\d+ page\(s\) built/)}, ${warnings} warnings` });
if (build.ok) {
  results.push({ gate: "4. Banned words", ok: true, detail: line(build.output, /slop-check: .*/) });
  results.push({ gate: "5. Links", ok: true, detail: line(build.output, /link-check: .*/) });

  const types = run("npx", ["astro", "check"]);
  report("astro-check.txt", types.output);
  results.push({ gate: "Types (extra)", ok: types.ok, detail: (types.output.match(/- \d+ (errors|warnings|hints)/g) ?? []).join(" ").replaceAll("- ", "") });

  for (const [gate, script, pattern] of [
    ["2. Lighthouse", "lighthouse", /lighthouse [\d.]+ .*/],
    ["3. axe-core", "a11y", /axe-core: .*/],
    ["6. Screenshots", "screenshots", /screenshots: .*/],
    ["7–9. Reduced motion, no JS, page weight", "behaviour", /behaviour: .*/],
  ] as const) {
    const r = run("node", [`scripts/${script}.ts`]);
    results.push({ gate, ok: r.ok, detail: line(r.output, pattern) });
  }
}

report("summary.md", ["# Quality gates", "", "| Gate | Result | Detail |", "| --- | --- | --- |", ...results.map((r) => `| ${r.gate} | ${r.ok ? "PASS" : "FAIL"} | ${r.detail} |`)].join("\n"));
console.log(results.map((r) => `${r.ok ? "PASS" : "FAIL"}  ${r.gate}: ${r.detail}`).join("\n"));
if (results.some((r) => !r.ok)) process.exit(1);
