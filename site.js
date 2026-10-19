// Page behavior. Content and dates live in config.js.
const $ = (id) => document.getElementById(id);
const TAGS = { new: "New", favorite: "Fan favorite", limited: "Limited" };
const money = (n) => "$" + Number(n).toFixed(Number(n) % 1 ? 2 : 0);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function renderPopup() {
  const p = SITE.nextPopup;
  if (p.start) {
    const start = new Date(p.start);
    const end = p.end ? new Date(p.end) : null;
    $("popup-date").textContent = start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const t = (d) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    $("popup-time").textContent = end ? `${t(start)} to ${t(end)}, or until sold out` : `Starts ${t(start)}`;
    startCountdown(start, end);
  }
  $("popup-place").textContent = p.place;
  $("popup-note").textContent = p.note;
  if (p.mapQuery) {
    const a = $("map-link");
    a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.mapQuery);
    a.hidden = false;
  }
}

function countdown(target, ids, onDone) {
  const tick = () => {
    const diff = target - new Date();
    if (diff <= 0) { $(ids.box).hidden = true; onDone && onDone(); return; }
    $(ids.box).hidden = false;
    $(ids.d).textContent = Math.floor(diff / 864e5);
    $(ids.h).textContent = Math.floor((diff / 36e5) % 24);
    $(ids.m).textContent = Math.floor((diff / 6e4) % 60);
    setTimeout(tick, 30000);
  };
  tick();
}

function startCountdown(start, end) {
  countdown(start, { box: "countdown", d: "cd-d", h: "cd-h", m: "cd-m" }, () => {
    const now = new Date();
    $("popup-time").textContent = !end || now < end
      ? "Happening now. Come on down!"
      : "That's a wrap. Thank you! Next date coming soon.";
  });
}

function renderMenu() {
  $("menu-grid").innerHTML = SITE.menu.map((m) => `
    <article class="menu-item">
      ${m.img
        ? `<img src="${m.img}" alt="${esc(m.name)}" loading="lazy">`
        : `<div class="menu-noimg"><img src="img/monogram.png" alt="" loading="lazy"></div>`}
      <div class="menu-body">
        ${m.tag ? `<span class="tag tag-${m.tag}">${TAGS[m.tag] || m.tag}</span>` : ""}
        <h3>${esc(m.name)}</h3>
        <p>${esc(m.desc)}</p>
      </div>
    </article>`).join("");
}

// Dates for the pre-order window, shown as MM/DD/YYYY in Mountain time
const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", timeZone: "America/Denver" });
const opensText = () => fmtDate(new Date(SITE.preorder.opensOn));
const dueText = () => fmtDate(new Date(new Date(SITE.preorder.closesOn) - 60000)); // closes at midnight, so last day is the day before

function renderPreorder() {
  const p = SITE.preorder;
  const state = preorderState();
  const status = $("po-status");

  if (state === "open") {
    status.textContent = "Open";
    status.className = "status status-open";
    $("po-headline").textContent = "Pre-orders are open";
    $("po-message").textContent = p.openMessage;
    if (p.closesOn) $("po-window").innerHTML = `All pre-orders must be in by <strong>${dueText()}</strong>`;
    buildOrderForm();
    return;
  }

  $("po-message").textContent = p.closedMessage;
  if (state === "upcoming") {
    setupEarlyAccess();
    const opens = new Date(p.opensOn);
    $("po-headline").textContent = `Pre-orders open ${opensText()}`;
    if (p.closesOn) $("po-window").innerHTML = `Order window: <strong>${opensText()}</strong> through <strong>${dueText()}</strong>`;
    countdown(opens, { box: "po-countdown", d: "po-d", h: "po-h", m: "po-m" }, () => location.reload());
  } else {
    $("po-headline").textContent = "Pre-orders are closed";
    $("po-message").textContent = p.closedAfterMessage || p.closedMessage;
  }
}

// Early access code box (only while pre-orders are closed). The server checks the code.
let earlyCode = "";
function setupEarlyAccess() {
  const box = $("early");
  const unlock = (code) => {
    earlyCode = code;
    try { sessionStorage.setItem("bb-early", code); } catch (e) {}
    box.hidden = true;
    $("po-countdown").hidden = true;
    $("po-status").textContent = "Early access";
    $("po-status").className = "status status-open";
    $("po-headline").textContent = "You're in early!";
    $("po-message").textContent = "Your early access code worked. Place your order before everyone else.";
    buildOrderForm();
  };
  const check = async (code) => {
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "checkCode", earlyCode: code }) });
    return r.ok;
  };
  box.hidden = false;
  box.addEventListener("submit", async (e) => {
    e.preventDefault();
    const code = $("early-code").value.trim();
    const err = $("early-error");
    err.hidden = true;
    if (!code) return;
    const btn = box.querySelector("button");
    btn.disabled = true;
    try {
      if (await check(code)) unlock(code);
      else { err.textContent = "That code didn't work. Double-check it and try again."; err.hidden = false; }
    } catch (ex) {
      err.textContent = "Couldn't check the code. Try again in a minute."; err.hidden = false;
    }
    btn.disabled = false;
  });
  // Remember a working code for this visit
  let saved = "";
  try { saved = sessionStorage.getItem("bb-early") || ""; } catch (e) {}
  if (saved) check(saved).then((ok) => ok && unlock(saved)).catch(() => {});
}

function buildOrderForm() {
  if (buildOrderForm.done) return;
  buildOrderForm.done = true;
  const items = SITE.menu.filter((m) => m.preorder !== false);
  $("po-pickup").textContent = SITE.preorder.pickup;
  if (SITE.freebie) {
    const fb = $("po-freebie");
    fb.innerHTML = `<legend>${esc(SITE.freebie.title)} <span class="req">*</span></legend>
      <p class="po-small">${esc(SITE.freebie.note)}</p>` +
      SITE.freebie.options.map((f) => `
      <label class="freebie-opt"><input type="radio" name="freebie" value="${esc(f.name)}">
        <span><strong>${esc(f.name)}</strong><small>${esc(f.desc)}</small></span><em>FREE</em></label>`).join("");
    fb.hidden = false;
  }
  $("po-pay").innerHTML = `<strong>Pre-orders are paid ahead.</strong> After you place your order, Venmo <strong>@${esc(SITE.payment.venmo)}</strong> (last 4 of phone: ${esc(SITE.payment.venmoLast4)}) with your order # in the note. Your order is made once it's paid.`;
  $("po-items").innerHTML = items.map((m, i) => `
    <div class="qty-row">
      <div><strong>${esc(m.name)}</strong><span>${money(m.price)} each</span></div>
      <div class="qty">
        <button type="button" data-i="${i}" data-d="-1" aria-label="Fewer ${esc(m.name)}">&minus;</button>
        <input type="number" id="qty-${i}" min="0" max="${m.max || 12}" value="0" inputmode="numeric" aria-label="${esc(m.name)} quantity">
        <button type="button" data-i="${i}" data-d="1" aria-label="More ${esc(m.name)}">+</button>
      </div>
    </div>`).join("");

  const form = $("po-form");
  const qty = (i) => Math.max(0, Math.min(items[i].max || 12, Math.floor(Number($("qty-" + i).value) || 0)));
  const update = () => {
    const total = items.reduce((s, m, i) => s + qty(i) * m.price, 0);
    $("po-total").textContent = money(total);
  };
  $("po-items").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (!b) return;
    const i = +b.dataset.i;
    $("qty-" + i).value = Math.max(0, Math.min(items[i].max || 12, qty(i) + +b.dataset.d));
    update();
  });
  $("po-items").addEventListener("input", update);
  form.hidden = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("po-error");
    err.hidden = true;
    const body = {
      name: form.name.value, phone: form.phone.value, email: form.email.value,
      notes: form.notes.value, website: form.website.value, earlyCode, items: {},
    };
    items.forEach((m, i) => (body.items[m.name] = qty(i)));
    const pick = form.querySelector('input[name="freebie"]:checked');
    body.freebie = pick ? pick.value : "";
    // Name, phone, and email are all required
    const problem =
      !body.name.trim() ? ["name", "Please add your name."] :
      body.phone.replace(/\D/g, "").length < 10 ? ["phone", "Please add your phone number (10 digits)."] :
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) ? ["email", "Please add a valid email address."] :
      !Object.values(body.items).some((q) => q > 0) ? [null, "Pick at least one bakery item. The free treat comes with an order, not on its own."] :
      SITE.freebie && !body.freebie ? [null, "Please pick your free " + SITE.freebie.options.map((f) => f.name.toLowerCase()).join(" or ") + "."] : null;
    if (problem) {
      err.textContent = problem[1];
      err.hidden = false;
      if (problem[0]) form[problem[0]].focus();
      return;
    }
    const btn = $("po-submit");
    btn.disabled = true;
    btn.textContent = "Sending...";
    try {
      const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Something went wrong.");
      form.hidden = true;
      $("po-done-list").innerHTML = (data.items || []).map((it) => `<li>${it.qty} &times; ${esc(it.name)}</li>`).join("") +
        (data.freebie ? `<li class="free-line">+ FREE ${esc(data.freebie)}</li>` : "");
      $("po-done-total").textContent = money(data.total || 0);
      $("po-done-id").textContent = data.id || "";
      const pay = SITE.payment;
      $("po-done-venmo").textContent = "@" + pay.venmo;
      $("po-done-id2").textContent = data.id || "";
      $("po-done-last4").textContent = pay.venmoLast4;
      $("po-venmo-link").href = `https://venmo.com/u/${pay.venmo}`;
      $("po-done").hidden = false;
      $("po-done").scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
      btn.disabled = false;
      btn.textContent = "Place pre-order";
    }
  });
}

// Home page pre-order pop-up. Shows once per visit (not again after it's closed).
function showPromo() {
  const box = $("promo");
  try { if (sessionStorage.getItem("bb-promo-seen")) return; } catch (e) {}
  const state = preorderState();
  if (state === "open") {
    $("promo-eyebrow").textContent = "Now open";
    $("promo-title").textContent = "Pre-orders are open!";
    if (SITE.preorder.closesOn) $("promo-text").textContent = `Get your order in by ${dueText()}. Every pre-order comes with a FREE holiday jam or honey butter!`;
  } else if (state === "upcoming") {
    $("promo-eyebrow").textContent = "Coming soon";
    $("promo-title").textContent = `Pre-orders open ${opensText()}`;
    if (SITE.preorder.closesOn) $("promo-text").textContent = `Order window runs ${opensText()} through ${dueText()}. Every pre-order comes with a FREE holiday jam or honey butter!`;
  }
  const close = () => {
    box.hidden = true;
    document.body.classList.remove("no-scroll");
    try { sessionStorage.setItem("bb-promo-seen", "1"); } catch (e) {}
  };
  $("promo-close").addEventListener("click", close);
  $("promo-later").addEventListener("click", close);
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) close(); });
  setTimeout(() => {
    box.hidden = false;
    document.body.classList.add("no-scroll");
    box.querySelector(".btn").focus();
  }, 300);
}

// "This pre-order only" banner for the free holiday treat (main page + pre-order page)
function renderFreebiePromo() {
  const box = $("freebie-promo");
  const f = SITE.freebie;
  if (!f || preorderState() === "closed") return; // hide once this round is over
  // Pre-order page already shows the dates right above, so only the main page repeats them
  const dates = SITE.preorder.closesOn && !$("po-status") ? ` &middot; ${opensText().slice(0, 5)} to ${dueText().slice(0, 5)}` : "";
  box.classList.add("freebie-strip");
  box.innerHTML = `
    <span class="freebie-badge">This pre-order only</span>
    <p>FREE <strong>${f.options.map((o) => esc(o.name)).join("</strong> or <strong>")}</strong> with every pre-order${dates}</p>
    ${$("po-status") ? "" : '<a href="preorder.html">Pre-order &rarr;</a>'}`;
  box.hidden = false;
}

// Each page only has some of these sections
if ($("freebie-promo")) renderFreebiePromo();
if ($("promo")) showPromo();
if ($("popup-date")) renderPopup();
if ($("menu-grid")) renderMenu();
if ($("po-status")) renderPreorder();
for (const id of ["ig-link-next", "ig-link-po", "ig-link-footer"]) if ($(id)) $(id).href = SITE.instagram;
$("year").textContent = new Date().getFullYear();
