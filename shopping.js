// Shopping list for the Nov 2026 pre-order bake. Edit this file to change items,
// amounts, prices, or stores. The portal reads it; the "bought" checkmarks are saved by /api/shopping.
//
// Scaled from the live orders on Nov 18, 2026 (29 orders):
//   120 cookies (9 batches of 15, 1 spare batch), 228 rolls (10 batches of 24),
//   28 sourdough loaves (8 plain + 7 choc chip + 11 herb & cheese, + 2 spares),
//   17 honey butters + 12 jams in 4 oz jars (12 honey butter batches, 1 jam batch).
// Prices checked Nov 18, 2026 across Costco, Sam's, King Soopers, Walmart, Target. Cheapest sensible pick wins.
// King Soopers prices marked "digital" need the coupon clipped in the app; those run Nov 18 to 26.

window.SHOPPING = {
  note: "Prices checked Nov 18, 2026. Three stops: King Soopers for this week's digital deals, Costco for bulk, Walmart for jars and small stuff. Skip anything she already has in the pantry.",
  stores: [
    {
      name: "King Soopers",
      where: "Fort Collins. Clip the digital coupons in the app first. Deals good Nov 18 to 26.",
      items: [
        { id: "butter", name: "Unsalted butter", product: "Kroger Unsalted Butter Sticks, 1 lb", need: "8.5 lb (cookies 3.3, rolls 2.2, honey butter 3)", packs: 10, pkg: "1 lb", price: 1.99,
          note: "Digital deal, shelf is ~$4.79. Usually limit 5 per transaction: ring up twice, or get 5 here and one Kirkland 4-pack (~$10) at Costco." },
        { id: "eggs", name: "Large eggs", product: "Kroger Cage-Free Large Eggs, dozen", need: "28 eggs (18 cookies, 10 rolls)", packs: 3, pkg: "dozen", price: 1.49, note: "Digital deal. Shelf is $3.99." },
        { id: "milk", name: "Whole milk", product: "King Soopers Vitamin D Whole Milk", need: "15 cups for rolls", packs: 1, pkg: "gallon", price: 2.99, note: "Weekly ad price." },
        { id: "sugar", name: "Granulated sugar", product: "Smart Way Granulated Sugar", need: "~3 lb (rolls 1.5, cookies 1, jam 0.5)", packs: 1, pkg: "4 lb", price: 2.49, note: "Digital deal, shelf $3.99." },
        { id: "mozz", name: "Shredded mozzarella", product: "Kroger Shredded Mozzarella, 32 oz Big Deal bag", need: "44 oz, ~4 oz per herb & cheese loaf (11 loaves)", packs: 2, pkg: "32 oz", price: 4.99,
          note: "Digital deal on 'Kroger cheese 32 oz, select varieties', shelf $7.29. Confirm the mozzarella bag counts. Leftover freezes." },
      ],
    },
    {
      name: "Costco",
      where: "Timnath. Bulk items where the warehouse price is far below grocery.",
      items: [
        { id: "breadflour", name: "Bread flour", product: "King Arthur Unbleached Bread Flour, 12 lb", need: "35.5 lb (28 loaves at 500 g + starter feeds)", packs: 3, pkg: "12 lb", price: 9.59,
          note: "If they have Ardent Mills Bread Flour 25 lb (~$8), buy 2 of those instead and save ~$13. King Soopers is $1.30/lb for the same King Arthur." },
        { id: "apflour", name: "All-purpose flour", product: "Ardent Mills or Miller All Purpose Flour, 25 lb", need: "15.4 lb (rolls 11, cookies 4.4)", packs: 1, pkg: "25 lb", price: 8.49, note: "Sam's Member's Mark 25 lb is the same money. Walmart 25 lb is $10.77." },
        { id: "chips", name: "Semisweet chocolate chips", product: "Kirkland Signature Semi-Sweet Chocolate Chips, 4.5 lb", need: "109 oz (cookies 67 oz, 7 choc chip loaves at ~6 oz each)", packs: 2, pkg: "4.5 lb", price: 11.99,
          note: "$0.17/oz. Next best is Nestle on King Soopers digital at $3.49 per 12 oz ($0.29/oz), ten bags." },
        { id: "vanilla", name: "Pure vanilla extract", product: "Kirkland Signature Pure Vanilla, 16 oz", need: "5.5 oz (cookies 4.5, honey butter 1)", packs: 1, pkg: "16 oz", price: 9.71, note: "Walmart wants $20.95 for 8 oz of McCormick. Skip if she has a bottle." },
        { id: "honey", name: "Honey", product: "Kirkland Signature Raw USA Honey, 48 oz", need: "36 oz for 12 honey butter batches", packs: 1, pkg: "48 oz", price: 10.19, note: "Regional 'Local' Kirkland label is ~$12.50 if she wants the Colorado story. Target 40 oz $11.99, Walmart 40 oz $13.98." },
        { id: "yeast", name: "Instant yeast", product: "SAF Instant Yeast red label, 1 lb brick", need: "6.7 oz for 10 roll batches", packs: 1, pkg: "1 lb", price: 4.19,
          note: "Often out of stock. Backup: Walmart Fleischmann's 4 oz jars at $5.48 each, buy 2. Keep the extra in the freezer." },
        { id: "maldon", name: "Flaky sea salt", product: "Maldon Sea Salt Flakes tub, 20 oz", need: "a sprinkle on 120 cookies", packs: 1, pkg: "20 oz", price: 8.59, note: "Same money as the 8.5 oz box at King Soopers ($9.99). Skip if she has some." },
        { id: "kosher", name: "Kosher salt", product: "Morton Coarse Kosher Salt, 53 oz", need: "~1 lb total (sourdough 196 g, rolls, cookies)", packs: 1, pkg: "53 oz", price: 2.85, note: "Walmart 3 lb box $3.82, King Soopers $4.29. Skip if she has some." },
      ],
    },
    {
      name: "Walmart",
      where: "Fort Collins. Jars, small spice jars, and the fruit. Target has the jars at the same $11.99 if it is closer.",
      items: [
        { id: "jars", name: "4 oz jelly jars with lids", product: "Ball Quilted Crystal Regular Mouth Jelly Jars, 4 oz, 12 ct", need: "29 jars (17 honey butter + 12 jam)", packs: 3, pkg: "12 ct", price: 11.98,
          note: "$1 a jar. King Soopers is $16.99 a dozen. Online sellers show $12.98 to $25, the shelf tier is $11.98." },
        { id: "brownsugar", name: "Light brown sugar", product: "Great Value Light Brown Sugar, 2 lb", need: "4.8 lb (cookies 4.2, jam 0.6)", packs: 3, pkg: "2 lb", price: 1.98, note: "Sam's 7 lb bag is $6.98 if you are there anyway." },
        { id: "italian", name: "Italian seasoning", product: "Great Value Italian Seasoning, 2 oz", need: "~2.5 oz, about 1.5 Tbsp per herb & cheese loaf", packs: 2, pkg: "2 oz", price: 1.97, note: "Costco McCormick 6.25 oz is $5.49 if she wants one big jar." },
        { id: "cranberries", name: "Cranberries", product: "Fresh Cranberries, 12 oz bag (Thanksgiving rollback)", need: "1.5 lb for the jam", packs: 2, pkg: "12 oz", price: 0.76,
          note: "Recipe says frozen; nobody sells frozen retail bags locally. Fresh works the same in the slow cooker, or freeze them overnight." },
        { id: "strawberries", name: "Frozen strawberries", product: "Great Value Whole Strawberries, 16 oz", need: "1.5 lb for the jam", packs: 2, pkg: "16 oz", price: 2.86, note: "Costco only sells a 6 lb bag ($14)." },
        { id: "cinnamon", name: "Ground cinnamon", product: "Great Value Ground Cinnamon, 2.5 oz", need: "~4 tsp (honey butter 3, jam 1)", packs: 1, pkg: "2.5 oz", price: 1.32, note: "Skip if she has some." },
        { id: "allspice", name: "Ground allspice", product: "Great Value Ground Allspice, 2 oz", need: "2 tsp for the jam", packs: 1, pkg: "2 oz", price: 2.12, note: "Costco and Sam's do not carry it." },
        { id: "ginger", name: "Ground ginger", product: "Great Value Ground Ginger, 1.5 oz", need: "1/2 tsp for the jam", packs: 1, pkg: "1.5 oz", price: 2.36, note: "Skip if she has some." },
        { id: "soda", name: "Baking soda", product: "Great Value Baking Soda, 16 oz", need: "~7 tsp for cookies", packs: 1, pkg: "16 oz", price: 0.92, note: "Costco and Sam's only sell a 13.5 lb bag." },
        { id: "parchment", name: "Parchment paper (optional)", product: "Great Value Parchment Paper, 50 sq ft", need: "cookie sheets and bannetons", packs: 1, pkg: "50 sq ft", price: 3.16, note: "Costco 2-pack (410 sq ft) is $10.75 if she bakes a lot." },
      ],
    },
  ],
};
