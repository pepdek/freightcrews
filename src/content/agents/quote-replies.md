---
order: 1
name: "Quote replies"
title: "Quote reply agent for freight brokers"
h1: "Quote replies,"
h1_italic: "drafted before you sit down."
meta: "A Claude agent that reads incoming quote requests, pulls lane details, and drafts replies for your reps to approve."
oneliner: "Reads every quote request, pulls the lane details, and drafts a reply in your voice. Your rep adds the rate and sends."
replaces: "Replaces: ~1.5 hrs/day of quote emails"
job:
  - "Open the request and find origin, destination, dates, equipment, weight."
  - "Check what’s missing."
  - "Look up recent rates for the lane."
  - "Type a reply."
  - "Log it."
input: "quote emails in your shared inbox."
output: "a draft reply with the load details confirmed, questions for anything missing, and a summary line for your log."
approval: "The draft waits in your inbox. Your rep sets the rate and hits send. The agent never sends a quote."
access:
  - "Your quote inbox (read and draft)"
  - "Your rate notes or recent quote log (read)"
time_value: "1.5 hrs"
time_unit: "/day per rep"
faq:
  - q: "Does it set the rate?"
    a: "No. Pricing stays with your rep. The agent prepares everything around the number."
  - q: "Will it sound like a robot?"
    a: "It writes from your past replies and a style note we agree on. Your rep edits anything before it goes."
  - q: "What if the request is missing details?"
    a: "It drafts the follow-up questions instead of a quote."
---
