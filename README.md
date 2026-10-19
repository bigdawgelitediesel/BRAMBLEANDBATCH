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
| `preorder.html` | Shows **Closed / Pre-orders open 11/09/2026** with a countdown. Opens by itself on that date and shows the order form |
| `portal.html` | Password-protected. Every order (who ordered what, contact, notes) with Paid / Bagged & ready / Picked up checkboxes, still-to-collect total, running totals per item (still to bag), filters, delete, CSV download |

## Changing things

Almost everything lives in **`config.js`**:
- `menu`: items, descriptions, **prices**, photos, per-order max
- `preorder.opensOn` / `closesOn` / `forceClosed`: when pre-orders are open (Mountain time)
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

`api/orders.js` saves each order as its own JSON file in the private Vercel Blob store `brambleandbatch` (`orders/` folder). Customers pay at pickup; there is no online payment.

## Still to do

- [ ] Real prices from Abby (placeholders: Sourdough Loaf $12, Dinner Rolls half dozen $10, Brown Butter Chocolate Chip Cookies $4)
- [ ] Confirm per-order limits (placeholders: 4 / 4 / 24) and dinner roll description
- [ ] Abby's Instagram link
- [ ] Dinner roll photo (shows the B&B monogram for now)
- [ ] Abby reads and adjusts the "Our Story" text (drafted in her voice)
- [ ] Pickup date and place for pre-orders
- [ ] Consider a longer portal password before real customer info comes in
