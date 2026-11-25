import { getCollection, getEntry } from "astro:content";
import { SITE } from "./config";

const byOrder = <T extends { data: { order: number } }>(list: T[]) => list.sort((a, b) => a.data.order - b.data.order);

export async function agentLinks() {
  return byOrder(await getCollection("agents")).map((a) => ({ ...a.data, id: a.id, href: `/agents/${a.id}/` }));
}

export async function nicheLinks() {
  return byOrder(await getCollection("niches")).map((n) => ({
    ...n.data,
    id: n.id,
    href: `/claude-use-cases/${n.id}/`,
    count: n.data.groups.reduce((sum, g) => sum + g.jobs.length, 0),
  }));
}

/** The one gate for every Proof surface: flag on AND the demo no longer a draft. */
export async function proofEntry() {
  if (!SITE.DEMO_PUBLISHED) return undefined;
  const entry = await getEntry("proof", "demo");
  return entry && !entry.data.draft ? entry : undefined;
}
