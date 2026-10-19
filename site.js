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

function renderPreorder() {
  const p = SITE.preorder;
  const state = preorderState();
  const status = $("po-status");

  if (state === "open") {
    status.textContent = "Open";
    status.className = "status status-open";
    $("po-headline").textContent = "Pre-orders are open";
    $("po-message").textContent = p.openMessage;
    buildOrderForm();
    return;
  }

  $("po-message").textContent = p.closedMessage;
  if (state === "upcoming") {
    const opens = new Date(p.opensOn);
    const mmddyyyy = opens.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", timeZone: "America/Denver" });
    $("po-headline").textContent = `Pre-orders open ${mmddyyyy}`;
    countdown(opens, { box: "po-countdown", d: "po-d", h: "po-h", m: "po-m" }, () => location.reload());
  } else {
    $("po-headline").textContent = "Pre-orders are closed";
  }
}

function buildOrderForm() {
  const items = SITE.menu.filter((m) => m.preorder !== false);
  $("po-pickup").textContent = SITE.preorder.pickup;
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
      notes: form.notes.value, website: form.website.value, items: {},
    };
    items.forEach((m, i) => (body.items[m.name] = qty(i)));
    const btn = $("po-submit");
    btn.disabled = true;
    btn.textContent = "Sending...";
    try {
      const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Something went wrong.");
      form.hidden = true;
      $("po-done-list").innerHTML = (data.items || []).map((it) => `<li>${it.qty} &times; ${esc(it.name)}</li>`).join("");
      $("po-done-total").textContent = money(data.total || 0);
      $("po-done-id").textContent = data.id || "";
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

// Each page only has some of these sections
if ($("popup-date")) renderPopup();
if ($("menu-grid")) renderMenu();
if ($("po-status")) renderPreorder();
for (const id of ["ig-link-next", "ig-link-po", "ig-link-footer"]) if ($(id)) $(id).href = SITE.instagram;
$("year").textContent = new Date().getFullYear();
