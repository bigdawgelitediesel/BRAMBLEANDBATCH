// Pre-order API. Each order is its own JSON file in a private Vercel Blob store
// (orders/<time>-<id>.json), so two people ordering at once can't overwrite each other.
//
// POST   /api/orders                      -> customer places an order (only while pre-orders are open)
// GET    /api/orders     [x-admin-password] -> all orders + running totals
// PATCH  /api/orders     [x-admin-password] {id, field, value} -> set paid / ready (bagged) / pickedUp
// DELETE /api/orders?id= [x-admin-password] -> remove an order

const { put, get, list, del } = require("@vercel/blob");
const { SITE, preorderState } = require("../config.js");

const PREFIX = "orders/";

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  return new Promise((resolve) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => { try { resolve(JSON.parse(d || "{}")); } catch (e) { resolve({}); } });
  });
}

const clean = (v, max) => String(v || "").trim().slice(0, max);
const isAdmin = (req) => !!process.env.ADMIN_PASSWORD && req.headers["x-admin-password"] === process.env.ADMIN_PASSWORD;

async function readBlob(pathname) {
  const r = await get(pathname, { access: "private", useCache: false });
  if (!r || r.statusCode !== 200 || !r.stream) return null;
  try { return JSON.parse(await new Response(r.stream).text()); } catch (e) { return null; }
}

async function writeOrder(order) {
  await put(order.path, JSON.stringify(order), {
    access: "private", allowOverwrite: true, addRandomSuffix: false, contentType: "application/json",
  });
}

async function allOrders() {
  const paths = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    page.blobs.forEach((b) => paths.push(b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const orders = (await Promise.all(paths.map(readBlob))).filter(Boolean);
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function totals(orders) {
  const t = {};
  const blank = () => ({ qty: 0, revenue: 0, ready: 0, pickedUp: 0, collected: 0 });
  SITE.menu.forEach((m) => (t[m.name] = blank()));
  for (const o of orders) {
    for (const it of o.items) {
      t[it.name] = t[it.name] || blank();
      t[it.name].qty += it.qty;
      t[it.name].revenue += it.qty * it.price;
      if (o.ready) t[it.name].ready += it.qty;
      if (o.pickedUp) t[it.name].pickedUp += it.qty;
      if (o.paid) t[it.name].collected += it.qty * it.price;
    }
  }
  return t;
}

async function findOrder(id) {
  const orders = await allOrders();
  return orders.find((o) => o.id === id);
}

module.exports = async (req, res) => {
  try {
    if (req.method === "POST") {
      const b = await readBody(req);
      if (b.website) return send(res, 200, { ok: true }); // honeypot: bots fill hidden field
      if (preorderState() !== "open") return send(res, 403, { error: "Pre-orders are closed right now." });

      const name = clean(b.name, 80);
      const phone = clean(b.phone, 30);
      const email = clean(b.email, 120);
      const notes = clean(b.notes, 500);
      if (!name) return send(res, 400, { error: "Please add your name." });
      if (!phone && !email) return send(res, 400, { error: "Please add a phone number or email so Abby can reach you." });

      const items = [];
      for (const m of SITE.menu.filter((m) => m.preorder !== false)) {
        const qty = Math.floor(Number((b.items || {})[m.name]) || 0);
        if (qty < 0 || qty > (m.max || 12)) return send(res, 400, { error: `Max ${m.max || 12} ${m.name} per order.` });
        if (qty > 0) items.push({ name: m.name, qty, price: Number(m.price) || 0 });
      }
      if (!items.length) return send(res, 400, { error: "Pick at least one item." });

      const createdAt = new Date().toISOString();
      const id = Math.random().toString(36).slice(2, 8).toUpperCase();
      const order = {
        id, createdAt, name, phone, email, notes, items,
        total: items.reduce((s, it) => s + it.qty * it.price, 0),
        paid: false,
        ready: false,
        pickedUp: false,
        path: `${PREFIX}${createdAt.replace(/[:.]/g, "-")}-${id}.json`,
      };
      await writeOrder(order);
      return send(res, 200, { ok: true, id, total: order.total, items });
    }

    if (!isAdmin(req)) return send(res, 401, { error: "Wrong password." });

    if (req.method === "GET") {
      const orders = await allOrders();
      return send(res, 200, { orders, totals: totals(orders), state: preorderState() });
    }

    if (req.method === "PATCH") {
      const b = await readBody(req);
      const order = await findOrder(b.id);
      if (!order) return send(res, 404, { error: "Order not found." });
      if (!["paid", "ready", "pickedUp"].includes(b.field)) return send(res, 400, { error: "Unknown field." });
      order[b.field] = !!b.value;
      await writeOrder(order);
      return send(res, 200, { ok: true });
    }

    if (req.method === "DELETE") {
      const id = new URL(req.url, "http://x").searchParams.get("id");
      const order = await findOrder(id);
      if (!order) return send(res, 404, { error: "Order not found." });
      await del(order.path);
      return send(res, 200, { ok: true });
    }

    return send(res, 405, { error: "method" });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "Something went wrong. Try again in a minute." });
  }
};
