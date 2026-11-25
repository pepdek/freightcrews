---
order: 3
name: "Drayage"
noun: "drayage"
title: "20 jobs Claude can take off a drayage desk — FreightCrews"
meta: "20 jobs Claude can take off a drayage desk, grouped by who does the work today, with what stays with a person."
lead: "For container haulers and the brokers who book them, written with the Pacific Northwest ports in mind."
groups:
  - role: "Dispatch and planning"
    jobs:
      - { text: "Turn delivery orders into a load sheet.", agent: rate-con-intake }
      - "Track last free days and flag what’s at risk."
      - "Draft appointment requests."
      - "Morning list of containers by status."
      - "Driver assignment notes from the day’s plan."
      - "End-of-day handoff summary."
  - role: "Customer communication"
    jobs:
      - { text: "Status updates to customers.", agent: tracking-emails }
      - "Availability notices."
      - "Exception emails when a box is held."
      - "Weekly customer summaries."
  - role: "Billing and disputes"
    jobs:
      - "Build demurrage and per-diem dispute packets."
      - "Match chassis charges to moves."
      - { text: "Draft invoices for approval.", agent: pod-invoice-matching }
      - { text: "Missing-paperwork chase list.", agent: pod-invoice-matching }
      - "Flag accessorials with proof attached."
  - role: "Admin and compliance"
    jobs:
      - "Track driver document expiry dates."
      - "Summarize terminal notices."
      - "Draft SOPs for new dispatchers."
      - "Organize interchange receipts."
      - "Turn rate agreements into one-page summaries."
stays: "Dispatch decisions, rates, safety calls, anything sent to a terminal or customer that commits money."
---
