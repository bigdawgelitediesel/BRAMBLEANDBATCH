# Bramble & Batch

Website for Bramble & Batch, Abby's small-batch pop-up bakery in Fort Collins, Colorado.
"A small bakery with big dreams. Made from scratch in the heart of Fort Collins."

- Live site: https://brambleandbatch.vercel.app
- Pre-orders: https://brambleandbatch.vercel.app/preorder.html
- Owner portal: https://brambleandbatch.vercel.app/portal.html (also linked as "Owner login" in the footer)

## Pages

| Page | What it does |
|---|---|
| `index.html` | Homey main page: hero with logo, "Our Story" (signed Love, Abby), The Bakes (no prices), values, pre-order button |
| `preorder.html` | Shows **Closed / Pre-orders open 11/02/2026** (order window 11/02 through 11/17/2026, closes midnight 11/18 Mountain) with a countdown and an **early access code** box (works only before 11/02) (code = Vercel env `EARLY_ACCESS_CODE`, currently SECRETBATCH26, not case sensitive). Opens by itself on that date and shows the order form. Early orders are tagged "Early access" in the portal |
| `portal.html` | Password-protected. Orders that are Paid + Bagged & ready + Picked up move automatically to an **Archive** section (all-time completed orders, revenue, and totals per item; uncheck a box to move one back). Every order (who ordered what, contact, notes) with Paid / Bagged & ready / Picked up checkboxes, a Cancel order button (Are you sure? pop-up, cancelled orders stay listed but drop out of totals, Undo available), still-to-collect total, running totals per item (still to bag), filters, delete, CSV download |

## Changing things

Almost everything lives in **`config.js`**:
- `menu`: items, descriptions, **prices**, photos, per-order max
- `preorder.opensOn` / `closesOn` / `forceClosed`: when pre-orders are open (Mountain time)
- `preorder.pickupSlots` / `preorder.pickupAddress` / `preorder.title`: the pickup days customers choose between (Thanksgiving round: Tue 11/24 4-7pm or Wed 11/25 10am-1pm at 4138 Cedargate Drive). Shown on the home page strip, the pre-order page, the order form, and as a tag in the portal (Tuesday orders sort above Wednesday; filter dropdown has both). Each open order has a Switch to Tue/Wed button with an Are you sure? pop-up. Orders placed before slots existed count as the first slot.
- `preorder.pickup`: pickup / payment line on the order form
- `instagram`: Abby's Instagram link

Portal password is the Vercel env var `ADMIN_PASSWORD` (currently 8015).

## Deploy

```
git add -A && git commit -m "..." && git push
vercel deploy --prod --yes
```
(Pushing alone does not deploy.)

## How orders are stored

`api/orders.js` saves each order as its own JSON file in the private Vercel Blob store `brambleandbatch` (`orders/` folder). Pre-orders are paid ahead by Venmo (@abigailannef). The customer places the order, Venmos with the order # in the note, and Abby checks "Paid" in the portal. Unpaid orders are not made.

## Still to do

- [x] Real prices: Plain Sourdough $12, Chocolate Chip Sourdough $14, Italian Herb & Cheese Sourdough $14, Dinner Rolls dozen $12, Brown Butter Sea Salt Chocolate Chip Cookies 6 for $12
- [x] Per-order limit: up to 10 of each item
- [x] Abby's Instagram link (@thebrambleandbatch)
- [ ] Photos for dinner rolls, chocolate chip sourdough, herb & cheese sourdough (show the B&B monogram for now)
- [ ] Abby reads and adjusts the "Our Story" text (drafted in her voice)
- [ ] Pickup date and place for pre-orders
- [ ] Consider a longer portal password before real customer info comes in

## Free holiday treat (this pre-order)

Every pre-order must pick one free gift: **Holiday Jam** (berries, cranberries, orange zest) or **Honey Butter**. Set in `config.js` → `freebie` (set it to `null` to turn it off for future pre-orders). The portal shows each order's pick as a green "FREE ..." tag, plus green count cards for how many jams / honey butters to bag; the CSV has a "Free gift" column.
