/* Sahara — pure logic, no DOM. Safe to test in Node. */

function formatPKR(n) {
  return "Rs " + Number(n).toLocaleString("en-PK");
}

function lookupBeneficiary(id) {
  var key = String(id || "").trim().toUpperCase();
  if (!key) return { ok: false, error: "Enter a sample beneficiary ID, e.g. SAH-2026-4812." };
  if (!/^SAH-\d{4}-\d{4}$/.test(key)) {
    return { ok: false, error: "Sample IDs look like SAH-2026-4812. Real CNIC numbers are never accepted here." };
  }
  var found = SAMPLE_BENEFICIARIES[key];
  if (!found) return { ok: false, error: "No sample beneficiary with that ID. Try SAH-2026-4812, SAH-2026-2077 or SAH-2026-9930." };
  return { ok: true, data: found };
}

function cutGuard(due, received) {
  due = Number(due); received = Number(received);
  if (!isFinite(due) || !isFinite(received) || due < 0 || received < 0) {
    return { ok: false, error: "Enter valid non-negative amounts." };
  }
  var deduction = due - received;
  if (deduction <= 0) {
    return { ok: true, deduction: 0, message: "No deduction — you received the full amount. Well done, keep your receipt." };
  }
  return {
    ok: true,
    deduction: deduction,
    message: "Deduction detected: " + formatPKR(deduction) + " was kept back. That cut is illegal — your installment must arrive in full."
  };
}

function filterCentres(query, city) {
  var q = String(query || "").trim().toLowerCase();
  return SAMPLE_CENTRES.filter(function (c) {
    var cityOk = !city || city === "All" || c.city === city;
    var qOk = !q || c.name.toLowerCase().indexOf(q) !== -1 || c.city.toLowerCase().indexOf(q) !== -1;
    return cityOk && qOk;
  });
}

function makeReceiptNumber(seq) {
  return "SAH-2026-" + String(seq).padStart(4, "0");
}

function nextReceiptNumber(existingIds) {
  var max = 0;
  (existingIds || []).forEach(function (id) {
    var m = /^SAH-2026-(\d{4})$/.exec(id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return makeReceiptNumber(max + 1);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { formatPKR: formatPKR, lookupBeneficiary: lookupBeneficiary,
    cutGuard: cutGuard, filterCentres: filterCentres,
    makeReceiptNumber: makeReceiptNumber, nextReceiptNumber: nextReceiptNumber };
}
