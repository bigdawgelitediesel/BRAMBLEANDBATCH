// ============================================================
//  EDIT THIS FILE EACH MONTH. Everything else updates itself.
//  The website AND the order system both read from here.
// ============================================================
const SITE = {
  instagram: "https://instagram.com/",   // TODO: Abby's Instagram link

  nextPopup: {
    // Leave start blank ("") to show "Date coming soon"
    start: "",                      // e.g. "2026-11-14T09:00"
    end: "",                        // e.g. "2026-11-14T13:00"
    place: "",                      // e.g. "Old Town Square, Fort Collins"
    mapQuery: "",                   // address for Google Maps directions
    note: "The full menu drops the week of the pop-up.",
  },

  // Pre-orders open and close on their own based on these dates (Mountain time).
  preorder: {
    forceClosed: false,                       // true = closed no matter what the dates say
    opensOn: "2026-11-09T00:00:00-07:00",     // shows "Pre-orders open 11/09/2026" until then
    closesOn: "",                             // e.g. "2026-11-12T20:00:00-07:00", blank = stays open
    pickup: "Pick up at the next pop-up. Pay when you pick up.",
    closedMessage: "Pre-orders are closed right now. Check back when the window opens, or follow on Instagram so you don't miss it.",
    openMessage: "Reserve your loaves and cookies before they're gone.",
  },

  // PRICES ARE PLACEHOLDERS until Abby confirms them.
  // tag options: "new", "favorite", "limited". img is optional (put photos in /img)
  // preorder: false hides an item from the order form. max = most one person can order.
  menu: [
    { name: "Sourdough Loaf", desc: "Long, slow ferment. Blistered crust, open crumb, tangy and chewy.", price: 12, tag: "favorite", img: "img/loaves-scored.jpg", max: 4 },
    { name: "Dinner Rolls (half dozen)", desc: "Soft, buttery, pull-apart rolls. Made for the holiday table.", price: 10, tag: "new", max: 4 },
    { name: "Brown Butter Chocolate Chip Cookies", desc: "Brown butter dough, big chocolate chunks, crisp edges, soft middle, flaky sea salt.", price: 4, tag: "limited", img: "img/cookies.jpg", max: 24 },
  ],
};
// ============================================================

function preorderState(now = new Date()) {
  const p = SITE.preorder;
  if (p.forceClosed) return "closed";
  if (p.opensOn && now < new Date(p.opensOn)) return "upcoming";
  if (p.closesOn && now >= new Date(p.closesOn)) return "closed";
  return "open";
}

if (typeof module !== "undefined") module.exports = { SITE, preorderState };
