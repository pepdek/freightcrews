---
order: 2
name: "Rate con intake"
title: "Rate con intake agent"
h1: "Rate cons,"
h1_italic: "keyed once."
meta: "A Claude agent that reads rate confirmations and load tenders and prepares the load entry for your TMS."
oneliner: "Reads tenders and rate cons from email and PDFs, pulls every field, and lines it up for your TMS. Your rep checks it and saves."
replaces: "Replaces: ~30 min/day of re-typing"
job:
  - "Open the PDF."
  - "Find pickup, delivery, times, references, rate, accessorials."
  - "Type each field into the TMS."
  - "Fix the typos found later at billing."
input: "tender emails and rate con PDFs."
output: "a structured load sheet with every field, plus a list of anything unclear or missing."
approval: "Your rep reviews the sheet and enters or approves it in the TMS. The agent flags, it doesn’t guess."
access:
  - "The inbox where tenders arrive (read)"
  - "Your TMS, through the browser or an import file, depending on your system"
time_value: "30 min"
time_unit: "/day per rep"
faq:
  - q: "Does it work with my TMS?"
    a: "It works alongside most systems through your browser or an import file. We confirm the method on the teardown, before you pay anything."
  - q: "What about scanned PDFs?"
    a: "Clean scans work. Bad ones get flagged for a person."
  - q: "What if a field is wrong?"
    a: "It shows where each value came from, so your rep can check it in seconds."
---
