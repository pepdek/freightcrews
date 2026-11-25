---
order: 5
name: "POD + invoice matching"
title: "POD and invoice matching agent"
h1: "PODs matched,"
h1_italic: "invoices out the same day."
meta: "A Claude agent that matches delivered loads to PODs and prepares invoices for your billing team to approve."
oneliner: "Matches each delivered load to its POD, checks the paperwork, and prepares the invoice. Billing approves and sends."
replaces: "Replaces: ~30 min/day of billing checks"
job:
  - "Find the POD in email or a portal."
  - "Check signatures, dates and counts."
  - "Match it to the load and rate."
  - "Build the invoice."
  - "Chase what’s missing."
input: "PODs, the load record and the agreed rate."
output: "a matched packet, a drafted invoice, and a daily missing-paperwork list."
approval: "Billing approves every invoice. The agent never sends one or moves money."
access:
  - "The inbox where PODs arrive (read)"
  - "Your load and billing records (read)"
  - "Your accounting system, draft invoices only"
time_value: "30 min"
time_unit: "/day"
faq:
  - q: "Does it work with QuickBooks?"
    a: "Usually, through draft invoices your team approves. We confirm on the teardown."
  - q: "What about lumper and detention charges?"
    a: "It flags accessorials with their receipts so billing can add them."
  - q: "What if a POD is missing?"
    a: "It goes on the daily chase list with the carrier’s contact details."
---
