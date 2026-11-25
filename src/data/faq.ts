export const FAQ = [
  { q: "Is FreightCrews part of Anthropic?", a: "No. I’m an independent consultant. You buy Claude from Anthropic in your company’s name, and I set it up." },
  { q: "Do I need a new TMS or platform?", a: "No. Agents work alongside the email and systems you already use." },
  { q: "What does Claude cost on top of your price?", a: "Anthropic bills your subscription directly. I’ll recommend the plan on the teardown, before you buy anything." },
  { q: "Will the agent send things without us?", a: "Not by default. Every draft waits for a person. You decide later whether any routine task can run on its own." },
  { q: "What if it doesn’t work?", a: "You pay half to start and the other half only when the agent passes the acceptance test we wrote down on day one." },
  { q: "How much of my team’s time does the sprint take?", a: "About 3–4 hours total from the rep whose job we’re automating, mostly in the first two days." },
  { q: "What happens if I cancel Crew Care?", a: "You keep everything. The agents, prompts and playbook live in your accounts." },
  { q: "Do you work with brokers outside Washington?", a: "Yes. Everything is remote. If you’re near Tacoma, I can come in for kickoff." },
  { q: "Which systems do you work with?", a: "Email (Gmail or Outlook) in every case. For TMS, load boards and accounting, I confirm the method on the teardown, before you pay anything." },
];

/** Questions by their number in the brief (1-based). */
export const faq = (...numbers: number[]) => numbers.map((n) => FAQ[n - 1]!);

export const faqSchema = (items: { q: string; a: string }[]) => ({
  "@type": "FAQPage",
  mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});
