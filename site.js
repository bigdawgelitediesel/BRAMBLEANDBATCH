// ============================================================
//  EDIT THIS BLOCK EACH MONTH. Everything else updates itself.
// ============================================================
const SITE = {
  instagram: "https://instagram.com/",   // TODO: Abby's Instagram link

  nextPopup: {
    // Leave start blank ("") to show "Date coming soon"
    start: "",                      // e.g. "2026-11-14T09:00"
    end: "",                        // e.g. "2026-11-14T13:00"
    place: "",                      // e.g. "Paramount Cafe, 1607 Capitol Ave, Cheyenne"
    mapQuery: "",                   // address for Google Maps directions
    note: "Sample menu below. The real one drops the week of the pop-up.",
  },

  // tag options: "new", "favorite", "limited"
  menu: [
    { name: "Bramble Berry Hand Pies", desc: "Flaky butter crust, blackberry and raspberry filling, sugar top.", price: "$5", tag: "favorite" },
    { name: "Brown Butter Chocolate Chip Cookies", desc: "Crisp edges, soft middle, flaky salt.", price: "$3", tag: "" },
    { name: "Cinnamon Rolls", desc: "Big, soft, and covered in cream cheese frosting.", price: "$6", tag: "limited" },
    { name: "Lemon Blueberry Loaf", desc: "Bright, tender, with a lemon glaze.", price: "$4 / slice", tag: "" },
    { name: "Seasonal Scones", desc: "Whatever's in season that month.", price: "$4", tag: "new" },
    { name: "Mini Batch Box", desc: "A little of everything. The best way to try it all.", price: "$18", tag: "" },
  ],
};
// ============================================================

const $ = (id) => document.getElementById(id);
const TAGS = { new: "New", favorite: "Fan favorite", limited: "Limited" };

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

function startCountdown(start, end) {
  const box = $("countdown");
  const tick = () => {
    const now = new Date();
    const diff = start - now;
    if (diff <= 0) {
      box.hidden = true;
      if (!end || now < end) $("popup-time").textContent = "Happening now. Come on down!";
      else $("popup-time").textContent = "That's a wrap. Thank you! Next date coming soon.";
      return;
    }
    box.hidden = false;
    $("cd-d").textContent = Math.floor(diff / 864e5);
    $("cd-h").textContent = Math.floor((diff / 36e5) % 24);
    $("cd-m").textContent = Math.floor((diff / 6e4) % 60);
    setTimeout(tick, 30000);
  };
  tick();
}

function renderMenu() {
  $("menu-grid").innerHTML = SITE.menu.map((m) => `
    <article class="menu-item">
      ${m.tag ? `<span class="tag tag-${m.tag}">${TAGS[m.tag] || m.tag}</span>` : ""}
      <h3>${m.name}</h3>
      <p>${m.desc}</p>
      <span class="price">${m.price}</span>
    </article>`).join("");
}

renderPopup();
renderMenu();
$("ig-link-next").href = SITE.instagram;
$("ig-link-footer").href = SITE.instagram;
$("year").textContent = new Date().getFullYear();
