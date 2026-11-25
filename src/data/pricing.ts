export const OFFERS = [
  {
    name: "Teardown", price: "Free", amount: 0, monthly: false, cta: "Book a teardown",
    features: ["20-minute call", "The one task to automate first", "Hours estimate", "Three written recommendations the same day"],
  },
  {
    name: "First Agent Sprint", price: "$2,997", amount: 2997, monthly: false, cta: "Start with a teardown",
    features: ["One agent, one desk", "Live in 14 days", "Written acceptance test", "Shadow mode with rep approval", "One-page playbook", "14 days of questions after handover", "Half on signing, half when it passes"],
  },
  {
    name: "Desk Install", price: "$7,500", amount: 7500, monthly: false, cta: "Start with a teardown",
    features: ["Three agents", "Owner plus two reps trained", "About three weeks", "Shared business profile Claude reads before every task", "Recorded training", "Day-30 readout against your baseline", "Half on signing, half at handover"],
  },
  {
    name: "Crew Care", price: "$1,200/mo", amount: 1200, monthly: true, cta: "Ask about Crew Care",
    features: ["Monitoring and fixes (up to 3 hours a month)", "One new agent a month", "Friday hours-back report", "Answers within one business day", "Month to month, cancel anytime"],
  },
];

export const PRICING_NOTES = [
  { label: "Extra agents:", text: "from $1,000 each, quoted in writing first." },
  { label: "Work outside scope:", text: "$200/hour, quoted in writing first." },
  { label: "Your Claude subscription:", text: "paid to Anthropic in your company’s name. I’ll tell you which plan fits before you buy." },
];
