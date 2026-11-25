export interface Comparison {
  columns: string[];
  rows: { label: string; values: string[] }[];
}

export const COMPARE_SHORT: Comparison = {
  columns: ["FreightCrews", "Managed ops service", "Hire another rep"],
  rows: [
    { label: "Who owns the setup", values: ["You do — your Claude account", "The provider", "You do"] },
    { label: "Time to first result", values: ["14 days", "Varies", "4–8 weeks to hire and train"] },
    { label: "Price on the website", values: ["Yes", "Usually not", "Salary + taxes"] },
    { label: "If you stop paying", values: ["You keep every agent", "Work goes back to your team", "The seat is empty"] },
  ],
};

export const COMPARE_FULL: Comparison = {
  columns: ["FreightCrews", "Managed ops service", "Enterprise AI platform", "Hire another rep"],
  rows: [
    { label: "Who owns the setup", values: ["You (your Claude account)", "The provider", "You, under contract", "You"] },
    { label: "Time to first result", values: ["14 days", "Varies by provider", "Often 6+ weeks", "4–8 weeks to hire and train"] },
    { label: "Price published", values: ["Yes", "Usually not", "Usually not", "Salary + taxes"] },
    { label: "What you pay for", values: ["A fixed-price build, then optional care", "Ongoing service", "License + implementation", "Salary"] },
    { label: "If you stop paying", values: ["You keep every agent", "Work comes back to your team", "Access ends", "The seat is empty"] },
    { label: "Who handles exceptions", values: ["Your reps, with flagged lists", "The provider’s team", "Your team", "The rep"] },
    { label: "Best for", values: ["1–50 person desks that want to own their tools", "Brokers who want ops fully handed off", "Large operations with IT staff", "Work that needs judgment all day"] },
  ],
};
