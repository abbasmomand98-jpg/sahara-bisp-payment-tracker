# Sahara — BISP Payment Tracker (UX Concept)

An unofficial UX concept: one place where a BISP Kafaalat beneficiary can check
their quarterly installment status, find the right payment centre, catch an
illegal agent "cut" with the Cut Guard calculator, and track complaints.

**Sample data honesty note:** every beneficiary, centre, amount and complaint in
this demo is invented sample data. Sahara is NOT a government app and is NOT
connected to BISP. Never enter a real CNIC number — the demo accepts only sample
IDs like `SAH-2026-4812`. No real helpline numbers are shown; for real BISP
information, use the official BISP channels.

## How it works

- **Payment Status** — enter a sample beneficiary ID (try `SAH-2026-4812`) to see
  the current installment (Rs 13,500 for Oct–Dec 2026), its state, the assigned
  centre, and an installment timeline. Lookup is a pure function in `logic.js`
  over the sample table in `data.js`.
- **Payment Centres** — search by name or filter by city (Peshawar, Lahore,
  Karachi, Rawalpindi, Quetta, Multan). Each sample centre shows a queue status
  and an estimated wait, so a beneficiary can check before leaving home.
- **Cut Guard** — enter the amount due and the amount actually received.
  `cutGuard(due, received)` returns the deduction; if anything is missing, the
  app explains the cut is illegal and files a report with a receipt number
  (`SAH-2026-XXXX`) saved in `localStorage`.
- **Complaint Tracker** — lists sample complaints plus any reports filed from
  Cut Guard, with statuses (Under review / Resolved), all stored on-device.
- **Document Checklist** — a tick-off list (beneficiary card copy, receipts,
  visit slip, complaint receipt) saved in `localStorage` so it survives reloads.

Files: `index.html` (structure) · `style.css` (deep purple #6B21A8 theme) ·
`data.js` (sample data) · `logic.js` (pure, testable functions) ·
`app.js` (DOM wiring + localStorage) · `test.js` (Node smoke tests).

Run the tests: `node test.js`

## What you can learn from this project

- **Separating logic from the DOM.** All the maths lives in `logic.js` with no
  browser calls, so `test.js` can verify it in plain Node — a pattern that works
  for any small app.
- **Honest sample data.** When a concept touches real people's money, label every
  number as sample, never accept real identity numbers, and say plainly what the
  demo is not.
- **localStorage as a zero-backend store.** Complaints and checklists persist
  per device with a few lines of JSON code — enough for a prototype, and a good
  stepping stone to a real backend later.
- **Designing for low-literacy, high-stakes users.** Big amounts, plain words
  ("Deduction detected"), one action per screen — clarity beats cleverness when
  money is on the line.

**Fork it and adapt it:** the same pattern — status lookup + finder + a
"guard" calculator + a tracker — fits any benefit or subsidy scheme. Swap the
sample data in `data.js` for your own local problem, keep the honesty notes,
and make it yours.

## Links

- Live demo: https://abbasmomand98-jpg.github.io/sahara-bisp-payment-tracker/
- Code: https://github.com/abbasmomand98-jpg/sahara-bisp-payment-tracker
- Repo name: `sahara-bisp-payment-tracker`
