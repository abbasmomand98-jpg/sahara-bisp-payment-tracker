/* Sahara — sample data only. Every beneficiary, centre, amount and
   complaint below is invented for the demo. No real CNIC numbers,
   no real helplines, no real payment centres. */
var SAMPLE_BENEFICIARIES = {
  "SAH-2026-4812": {
    name: "Sample Beneficiary A",
    amount: 13500,
    state: "Ready to collect — in full",
    centre: "Saddar Payment Centre, Peshawar",
    next: "Next expected payment: Jan 2027 (quarterly cycle; exact date shown when announced)",
    timeline: [
      { quarter: "Jul–Sep 2026", status: "Collected in full", amount: 13500 },
      { quarter: "Apr–Jun 2026", status: "Collected in full", amount: 13500 },
      { quarter: "Jan–Mar 2026", status: "Collected in full", amount: 13500 },
      { quarter: "Oct–Dec 2026", status: "Ready at centre", amount: 13500 }
    ]
  },
  "SAH-2026-2077": {
    name: "Sample Beneficiary B",
    amount: 13500,
    state: "Payment processing — check again soon",
    centre: "Gulberg Camp Office, Lahore",
    next: "Next expected payment: Jan 2027 (quarterly cycle; exact date shown when announced)",
    timeline: [
      { quarter: "Jul–Sep 2026", status: "Collected in full", amount: 13500 },
      { quarter: "Apr–Jun 2026", status: "Collected in full", amount: 13500 },
      { quarter: "Oct–Dec 2026", status: "Processing", amount: 13500 }
    ]
  },
  "SAH-2026-9930": {
    name: "Sample Beneficiary C",
    amount: 10500,
    state: "Ready to collect — in full",
    centre: "Clifton Service Point, Karachi",
    next: "Next expected payment: Jan 2027 (quarterly cycle; exact date shown when announced)",
    timeline: [
      { quarter: "Jul–Sep 2026", status: "Collected in full", amount: 10500 },
      { quarter: "Oct–Dec 2026", status: "Ready at centre", amount: 10500 }
    ]
  }
};

var SAMPLE_CENTRES = [
  { name: "Saddar Payment Centre", city: "Peshawar", distance: "1.2 km", queue: "Short queue", wait: "~20 min", short: true },
  { name: "Gulberg Camp Office", city: "Lahore", distance: "3.4 km", queue: "Busy", wait: "~1 hr 30 min", short: false },
  { name: "Clifton Service Point", city: "Karachi", distance: "2.1 km", queue: "Moderate", wait: "~45 min", short: false },
  { name: "Satellite Town Centre", city: "Rawalpindi", distance: "4.0 km", queue: "Short queue", wait: "~25 min", short: true },
  { name: "Jinnah Road Centre", city: "Quetta", distance: "2.8 km", queue: "Moderate", wait: "~40 min", short: false },
  { name: "Bosan Road Point", city: "Multan", distance: "1.7 km", queue: "Short queue", wait: "~15 min", short: true }
];

var SAMPLE_COMPLAINTS = [
  { id: "SAH-2026-8814", description: "Deduction of Rs 1,000", status: "Under review" },
  { id: "SAH-2026-7731", description: "Wrong centre assigned", status: "Resolved" }
];

var DOC_CHECKLIST = [
  "Sample beneficiary card (demo copy)",
  "Payment receipt from last visit",
  "Centre visit slip",
  "Complaint receipt number (if filed)"
];
