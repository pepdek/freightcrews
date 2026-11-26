---
order: 3
name: "Carrier packet review"
title: "Carrier packet review agent"
h1: "Carrier packets,"
h1_italic: "checked before you book."
meta: "A Claude agent that reviews new carrier packets and flags mismatches in authority, insurance and contact details for your team."
oneliner: "Reviews each new carrier packet and flags anything that doesn’t match: names, MC/DOT numbers, insurance dates, contact details."
frees: "Frees up: ~20 min per new carrier"
job:
  - "Open the packet."
  - "Compare the W-9, insurance certificate and authority details."
  - "Look up the carrier’s public FMCSA record."
  - "Decide whether something looks off."
input: "the packet documents and the carrier’s public FMCSA record."
output: "a one-page check: what matches, what doesn’t, and what to ask the carrier."
approval: "Your team decides whether to onboard. The agent never approves or rejects a carrier."
access:
  - "The inbox or folder where packets arrive (read)"
  - "Public FMCSA records (read)"
time_value: "20 min"
time_unit: "per carrier"
faq:
  - q: "Does this replace my vetting service?"
    a: "No. It works alongside whatever you use today and catches the document mismatches people miss when they’re busy."
  - q: "Can it stop fraud?"
    a: "It flags warning signs. A person makes the call."
  - q: "Where does carrier data go?"
    a: "It stays in your accounts."
---
