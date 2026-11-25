---
order: 4
name: "Tracking emails"
title: "Tracking and status email agent"
h1: "Status updates,"
h1_italic: "without the chasing."
meta: "A Claude agent that drafts check-call emails to carriers and status updates to shippers from your load board."
oneliner: "Drafts the check-call emails to carriers and the status updates to shippers, on schedule, for every active load."
replaces: "Replaces: ~1 hr/day of check-call emails"
job:
  - "Scan active loads."
  - "Email each carrier for an update."
  - "Wait, then chase."
  - "Copy the answer into an email to the shipper."
input: "your list of active loads and replies from carriers."
output: "scheduled check-call drafts, shipper update drafts, and a list of late or silent loads."
approval: "Drafts wait for a rep. You can choose to let routine on-time updates go out automatically once you trust them. That’s your call, not the default."
access:
  - "Your shared inbox (read and draft)"
  - "Your active load list (read)"
time_value: "1 hr"
time_unit: "/day per rep"
faq:
  - q: "Will carriers know it’s AI?"
    a: "Messages go out from your team’s address and are approved by your reps."
  - q: "What about phone check calls?"
    a: "This agent handles email. Voice is a different setup we can talk about."
  - q: "What happens when a load is late?"
    a: "It moves to the top of the exceptions list for a person."
---
