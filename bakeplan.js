// Bake plan for the Nov 2026 pre-order. Edit this file to change days, times, or tasks.
// The portal reads it; "done" checkmarks are saved by /api/shopping (ids prefixed "bake-").
//
// Built around: one oven, two Dutch ovens (two loaves per ~75 min round), pickups Tue 11/24 4-7pm and Wed 11/25 10am-1pm.
// Sunday is mixing and prep only. Rolls and loaves must be fully cool before bagging.

window.BAKEPLAN = {
  note: "One oven, two Dutch ovens. Sunday is prep only, nothing in the oven. Everything cools completely on racks before it goes in a bag.",
  days: [
    {
      name: "Saturday 11/22",
      summary: "Shop and wake up the starter",
      tasks: [
        { id: "sat-shop", time: "Day", text: "Shop the list above. King Soopers digital coupons clipped in the app before checkout." },
        { id: "sat-starter", time: "Night", text: "Feed the starter big. She needs about 4.2 lb of peaked starter over two rounds (Sunday and Monday mixes)." },
        { id: "sat-optional", time: "Optional", text: "Jam and honey butter can be made today instead of Sunday. Both keep for weeks in the fridge." },
      ],
    },
    {
      name: "Sunday 11/23",
      summary: "Mix day. No baking.",
      tasks: [
        { id: "sun-starter", time: "Morning", text: "Feed starter up to about 2.3 kg so it peaks by early afternoon. Hold 300 g back and feed it again tonight for Monday's mix." },
        { id: "sun-jam", time: "Morning", text: "Jam: everything in the slow cooker, 4 hours on high, stir at 2 hours. Pulse twice in the blender, jar hot into 12 jars, lids on, fridge once cool." },
        { id: "sun-hb", time: "Midday", text: "Honey butter: all 12 batches at once (3 lb soft butter, 3 cups honey, 2 Tbsp vanilla, cinnamon to taste). Whip, fill 17 jars, fridge." },
        { id: "sun-mixa", time: "1pm", text: "Mix sourdough Wave A: 16 loaves (Wednesday's 14 plus 2 spares). Three big tubs. Add chips to 2 tubs' worth, cheese and Italian seasoning to 7 loaves' worth, on the last fold." },
        { id: "sun-folds", time: "1:30 to 3pm", text: "Three sets of stretch and folds, 30 minutes apart. Then let it bulk ferment, 4 to 6 hours in a cool kitchen." },
        { id: "sun-shape", time: "Evening", text: "Pre-shape, rest 20 min, final shape all 16 into floured bannetons. Cover, into the fridge for the cold proof. Label chip / herb / plain." },
        { id: "sun-cookie", time: "Evening", text: "Cookie dough: all 9 batches. Brown the butter in one big pot. Scoop every ball (1.5 oz scoop) onto sheet trays, cover, fridge. Bake days are grab and go." },
        { id: "sun-fridge", time: "Check", text: "Fridge space tonight: 16 bannetons, 29 jars, 9 batches of dough balls. Garage at November temps or coolers with ice packs work for the bannetons." },
      ],
    },
    {
      name: "Monday 11/24",
      summary: "Sourdough day, Wednesday's loaves",
      tasks: [
        { id: "mon-preheat", time: "6:30am", text: "Oven to 450 with both Dutch ovens inside. Full 45 minute preheat." },
        { id: "mon-bake", time: "7:15am to 5:30pm", text: "Bake Wave A straight from the fridge, two at a time. Each round: score, 20 min lids on at 450, lids off and drop to 400 for 40 min, out when the inside reads 205 to 210. Empty pots back in, oven to 450, 15 min, next pair. Eight rounds." },
        { id: "mon-mixb", time: "Morning", text: "While the oven runs: mix Wave B, Tuesday's 12 loaves (3 plain, 5 chip, 4 herb). Same folds and bulk." },
        { id: "mon-shapeb", time: "Mid-afternoon", text: "Shape Wave B into bannetons, fridge overnight." },
        { id: "mon-cool", time: "All day", text: "Loaves cool on racks 2 to 3 hours minimum. Do not bag today. Leave them out uncovered or in paper." },
        { id: "mon-cookies", time: "5:30 to 6:30pm", text: "Oven to 350. Bake Tuesday's 54 cookies from the chilled dough balls, 2 sheets per load, 12 to 13 min, flaky salt as they come out." },
        { id: "mon-rolls", time: "Night", text: "Tuesday's rolls: 3 batches (72 rolls). Shape into pans, cover, fridge overnight. They bake straight from the fridge in the morning." },
      ],
    },
    {
      name: "Tuesday 11/25",
      summary: "Tuesday's loaves and rolls, pickup 4 to 7pm, then the Wednesday night shift",
      tasks: [
        { id: "tue-rolls", time: "5:30am", text: "Oven to 350. Tuesday's rolls from the fridge, 2 pans per load, 2 loads, done by 6:45. Butter the tops, onto racks. They have all day to cool." },
        { id: "tue-preheat", time: "6:45am", text: "Oven to 450 with the Dutch ovens in." },
        { id: "tue-bake", time: "7:30am to 3pm", text: "Bake Wave B, Tuesday's 12 loaves, six rounds. Sticky note the time on anything out after 1pm." },
        { id: "tue-rolldough", time: "2 to 3:30pm", text: "Between rounds: mix Wednesday's rolls, 7 batches (156 rolls). Shape into pans, cover, let them proof at room temp for the evening bake." },
        { id: "tue-bag", time: "3:15pm", text: "Bag the 12 Tuesday orders. Morning loaves to early arrivals, the last pair to whoever comes after 5:30 (loaves need 2 to 3 hours to cool). Rolls, cookies, jar, check the order against the portal." },
        { id: "tue-pickup", time: "4 to 7pm", text: "Pickup. Mark each order Picked up in the portal." },
        { id: "tue-nightrolls", time: "7:30pm", text: "Oven to 350. Wednesday's 156 rolls, 4 loads, about 75 minutes. Butter the tops, spread out on racks, leave uncovered overnight." },
        { id: "tue-nightcookies", time: "8:45pm", text: "Wednesday's 66 cookies, 3 loads, about 45 minutes. Racks, uncovered overnight." },
      ],
    },
    {
      name: "Wednesday 11/26",
      summary: "Bag and hand off, pickup 10am to 1pm",
      tasks: [
        { id: "wed-refresh", time: "7:30am", text: "Optional: refresh Monday's loaves 10 minutes at 350 on a bare rack to crackle the crust, then cool 30 minutes before bagging." },
        { id: "wed-bag", time: "8:30am", text: "Bag the 17 Wednesday orders. Rolls and cookies from last night, fully cool. Check each against the portal." },
        { id: "wed-pickup", time: "10am to 1pm", text: "Pickup. Mark Picked up in the portal. Spare loaves go to whoever asks nicest." },
      ],
    },
  ],
};
