---
order: 1
name: "Freight brokers"
noun: "freight broker"
title: "50 jobs Claude can take off a freight broker desk — FreightCrews"
meta: "50 jobs Claude can take off a freight broker desk, grouped by who does the work today, with what stays with a person."
lead: "Grouped by who does the work at a small brokerage today. Each one is a draft or a check. A person still decides."
groups:
  - role: "Owner"
    jobs:
      - "Monday summary of loads, margin and late payers."
      - "Lane-by-lane margin review from your load export."
      - "Draft responses to shipper RFPs from your past bids."
      - "First drafts of job posts and interview questions."
      - "Summarize carrier claims and disputes for a decision."
      - "Draft SOPs from a recorded walkthrough."
      - "Compare insurance or software quotes side by side."
      - "Prepare the agenda and notes for your weekly sales meeting."
  - role: "Shipper sales"
    jobs:
      - { text: "Draft quote replies with lane details confirmed.", agent: quote-replies }
      - { text: "Ask for missing quote details automatically.", agent: quote-replies }
      - "Research a new shipper before the first call."
      - "Write follow-ups for quotes that went quiet."
      - "Turn call notes into CRM updates."
      - "Draft lane proposals for a prospect."
      - "Summarize a shipper’s past loads before a review."
      - "Draft win-back emails for lapsed customers."
      - "Build a shortlist of local shippers by industry."
      - "Prepare a QBR one-pager for your top accounts."
  - role: "Carrier sales and capacity"
    jobs:
      - "Draft load posts from a tender."
      - "Write first-touch emails to carriers on a lane."
      - { text: "Review carrier packets for mismatches.", agent: carrier-packet-review }
      - { text: "Compare a carrier’s packet to their public FMCSA record.", agent: carrier-packet-review }
      - "Summarize a carrier’s history with you before booking."
      - "Draft rate confirmations from the booked details."
      - "Answer routine carrier questions about pickup details."
      - "Keep a list of preferred carriers by lane."
      - "Draft counter-offers within limits you set."
      - "Prepare a daily list of uncovered loads."
  - role: "Operations and tracking"
    jobs:
      - { text: "Key tenders and rate cons into a load sheet.", agent: rate-con-intake }
      - { text: "Send scheduled check-call emails.", agent: tracking-emails }
      - { text: "Draft shipper status updates.", agent: tracking-emails }
      - { text: "Build the morning list of late or silent loads.", agent: tracking-emails }
      - "Draft appointment requests to receivers."
      - "Log delays with timestamps for detention claims."
      - "Summarize the end-of-day board for the next shift."
      - "Draft exception emails when a load slips."
      - "Track reference numbers across emails."
      - "Translate driver messages into clean status notes."
  - role: "Billing and accounting"
    jobs:
      - { text: "Match PODs to delivered loads.", agent: pod-invoice-matching }
      - { text: "Draft invoices for approval.", agent: pod-invoice-matching }
      - { text: "Make a daily missing-paperwork chase list.", agent: pod-invoice-matching }
      - "Flag accessorials with receipts attached."
      - "Draft past-due reminders by aging bucket."
      - "Reconcile carrier pay against rate cons."
      - "Prepare factoring submissions for review."
      - "Summarize the month’s receivables."
  - role: "Compliance and admin"
    jobs:
      - "Track insurance certificate expiry dates."
      - "Draft your AI use policy for staff."
      - "Organize shared drives and naming."
      - "Turn long contracts into one-page summaries."
stays: "Setting rates. Approving carriers. Sending anything that commits money or a load. Handling disputes."
---
