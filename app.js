/* Sahara — DOM wiring. Data lives in data.js, maths in logic.js. */
(function () {
  "use strict";

  var COMPLAINTS_KEY = "sahara-complaints-v1";
  var DOCS_KEY = "sahara-docs-v1";

  function $(id) { return document.getElementById(id); }

  function loadJSON(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v === null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  }

  /* ---------- tabs ---------- */
  document.querySelectorAll(".tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
      document.querySelectorAll(".panel").forEach(function (p) { p.classList.remove("active"); });
      btn.classList.add("active");
      $("tab-" + btn.getAttribute("data-tab")).classList.add("active");
    });
  });

  /* ---------- status lookup ---------- */
  document.querySelectorAll(".sample-id").forEach(function (btn) {
    btn.addEventListener("click", function () {
      $("beneficiary-id").value = btn.getAttribute("data-id");
      $("lookup-btn").click();
    });
  });

  $("lookup-btn").addEventListener("click", function () {
    var res = lookupBeneficiary($("beneficiary-id").value);
    var err = $("lookup-error"), card = $("status-card");
    if (!res.ok) {
      err.textContent = res.error;
      err.hidden = false;
      card.hidden = true;
      return;
    }
    err.hidden = true;
    var d = res.data;
    $("status-amount").textContent = formatPKR(d.amount);
    $("status-state").textContent = d.state;
    $("status-centre").textContent = "Collect at: " + d.centre;
    $("status-next").textContent = d.next;
    $("status-timeline").innerHTML = d.timeline.map(function (t) {
      return "<li><span>" + t.quarter + " — " + t.status + "</span><strong>" + formatPKR(t.amount) + "</strong></li>";
    }).join("");
    card.hidden = false;
  });

  /* ---------- centres ---------- */
  function renderCentres() {
    var list = filterCentres($("centre-search").value, $("city-filter").value);
    $("centre-count").textContent = list.length + " sample centre(s) found.";
    $("centre-list").innerHTML = list.map(function (c) {
      return '<div class="card"><strong>' + c.name + "</strong><br>" +
        c.city + " · " + c.distance + "<br>" +
        '<span class="pill ' + (c.short ? "short" : "busy") + '">' +
        c.queue + " · " + c.wait + "</span></div>";
    }).join("");
  }
  $("centre-search").addEventListener("input", renderCentres);
  $("city-filter").addEventListener("change", renderCentres);
  renderCentres();

  /* ---------- cut guard ---------- */
  var lastDeduction = 0;
  $("cutguard-btn").addEventListener("click", function () {
    var res = cutGuard($("due-amount").value, $("received-amount").value);
    var err = $("cutguard-error"), box = $("cutguard-result");
    if (!res.ok) {
      err.textContent = res.error;
      err.hidden = false;
      box.hidden = true;
      return;
    }
    err.hidden = true;
    lastDeduction = res.deduction;
    $("cutguard-message").textContent = res.message;
    $("cutguard-deduction").textContent = res.deduction > 0
      ? "Deduction: " + formatPKR(res.deduction)
      : "No deduction";
    $("cutguard-report").hidden = res.deduction <= 0;
    $("report-receipt").hidden = true;
    box.hidden = false;
  });

  $("report-btn").addEventListener("click", function () {
    var complaints = loadJSON(COMPLAINTS_KEY, SAMPLE_COMPLAINTS.slice());
    var receipt = nextReceiptNumber(complaints.map(function (c) { return c.id; }));
    complaints.unshift({
      id: receipt,
      description: "Deduction of " + formatPKR(lastDeduction),
      status: "Under review"
    });
    saveJSON(COMPLAINTS_KEY, complaints);
    $("report-receipt").textContent = "Report filed — your receipt number: " + receipt + " (saved on this device)";
    $("report-receipt").hidden = false;
    renderComplaints();
  });

  /* ---------- complaints ---------- */
  function renderComplaints() {
    var complaints = loadJSON(COMPLAINTS_KEY, SAMPLE_COMPLAINTS.slice());
    $("complaint-empty").hidden = complaints.length > 0;
    $("complaint-list").innerHTML = complaints.map(function (c) {
      var cls = c.status === "Resolved" ? "resolved" : "review";
      return '<div class="card"><strong>' + c.id + "</strong><br>" + c.description +
        '<br><span class="pill ' + cls + '">' + c.status + "</span></div>";
    }).join("");
  }
  renderComplaints();

  /* ---------- docs checklist ---------- */
  function renderDocs() {
    var checked = loadJSON(DOCS_KEY, {});
    $("doc-list").innerHTML = DOC_CHECKLIST.map(function (doc, i) {
      return '<li><input type="checkbox" data-doc="' + i + '"' +
        (checked[i] ? " checked" : "") + "><span>" + doc + "</span></li>";
    }).join("");
    var done = DOC_CHECKLIST.filter(function (_, i) { return checked[i]; }).length;
    $("doc-progress").textContent = done + " of " + DOC_CHECKLIST.length + " ready.";
    $("doc-list").querySelectorAll("input").forEach(function (box) {
      box.addEventListener("change", function () {
        var state = loadJSON(DOCS_KEY, {});
        state[box.getAttribute("data-doc")] = box.checked;
        saveJSON(DOCS_KEY, state);
        renderDocs();
      });
    });
  }
  renderDocs();
})();
