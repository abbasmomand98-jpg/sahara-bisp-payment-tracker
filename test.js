/* Sahara — smoke tests. Run: node test.js
   Covers: status lookup, Cut Guard maths (zero-cut, partial-cut, invalid),
   centre filter, complaint receipt format. */
var fs = require("fs");
var path = require("path");

function load(file) {
  var code = fs.readFileSync(path.join(__dirname, file), "utf8");
  var module = { exports: {} };
  var fn = new Function("module", "exports", "SAMPLE_BENEFICIARIES", "SAMPLE_CENTRES",
    "SAMPLE_COMPLAINTS", "DOC_CHECKLIST", code + "\nreturn module.exports;");
  return fn;
}

// data.js defines globals; load it in a shared scope first.
var dataCode = fs.readFileSync(path.join(__dirname, "data.js"), "utf8");
var logicCode = fs.readFileSync(path.join(__dirname, "logic.js"), "utf8");
var scope = new Function(dataCode + "\n" + logicCode +
  "\nreturn { formatPKR: formatPKR, lookupBeneficiary: lookupBeneficiary, " +
  "cutGuard: cutGuard, filterCentres: filterCentres, " +
  "makeReceiptNumber: makeReceiptNumber, nextReceiptNumber: nextReceiptNumber };")();

var total = 0, passed = 0;
function check(name, cond) {
  total++;
  if (cond) { passed++; console.log("PASS " + name); }
  else { console.log("FAIL " + name); }
}
function eq(a, b) { return a === b; }

// --- status lookup ---
var r = scope.lookupBeneficiary("SAH-2026-4812");
check("lookup known sample ID", r.ok && r.data.amount === 13500 && r.data.state.indexOf("Ready") === 0);
check("lookup is case-insensitive", scope.lookupBeneficiary("sah-2026-2077").ok === true);
check("lookup unknown sample ID rejected", scope.lookupBeneficiary("SAH-2026-0000").ok === false);
check("lookup rejects a 13-digit identity-like input", scope.lookupBeneficiary("3520212345678").ok === false);
check("lookup rejects empty input", scope.lookupBeneficiary("").ok === false);

// --- Cut Guard maths ---
var cg = scope.cutGuard(13500, 12500);
check("partial cut = 1000", cg.ok && cg.deduction === 1000);
check("partial cut message names amount", cg.message.indexOf("Rs 1,000") !== -1);
var zero = scope.cutGuard(13500, 13500);
check("zero cut = 0 deduction", zero.ok && zero.deduction === 0);
var over = scope.cutGuard(13500, 14000);
check("overpayment treated as no deduction", over.ok && over.deduction === 0);
check("negative amount rejected", scope.cutGuard(-5, 100).ok === false);
check("non-numeric rejected", scope.cutGuard("abc", 100).ok === false);
check("PKR formatting", scope.formatPKR(13500) === "Rs 13,500");

// --- centre filter ---
check("filter by city Peshawar = 1", scope.filterCentres("", "Peshawar").length === 1);
check("filter by city Quetta = 1", scope.filterCentres("", "Quetta").length === 1);
check("filter all cities = 6", scope.filterCentres("", "All").length === 6);
check("search 'saddar' finds Saddar", scope.filterCentres("saddar", "All").length === 1);
check("search + city mismatch = 0", scope.filterCentres("saddar", "Lahore").length === 0);
check("search no match = 0", scope.filterCentres("zzz", "All").length === 0);

// --- complaint receipts ---
check("receipt format SAH-2026-XXXX", /^SAH-2026-\d{4}$/.test(scope.makeReceiptNumber(8814)));
check("next receipt after samples = 8815", scope.nextReceiptNumber(["SAH-2026-8814", "SAH-2026-7731"]) === "SAH-2026-8815");
check("next receipt from empty list = 0001", scope.nextReceiptNumber([]) === "SAH-2026-0001");

console.log("\n" + passed + "/" + total + " smoke tests passed.");
process.exit(passed === total ? 0 : 1);
