// Shopping list "bought" checkmarks. One small JSON file in the private Blob store
// (shopping/state.json) so Abby and Jacob see the same checklist on any device.
//
// GET   /api/shopping  [x-admin-password] -> { bought: { itemId: true, ... } }
// PATCH /api/shopping  [x-admin-password] { id, value } -> set one item bought / not bought
// The list itself (items, amounts, prices, stores) lives in shopping.js; this only stores checkmarks.

const { put, get } = require("@vercel/blob");

const PATH = "shopping/state.json";

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

const isAdmin = (req) => !!process.env.ADMIN_PASSWORD && req.headers["x-admin-password"] === process.env.ADMIN_PASSWORD;

async function readState() {
  try {
    const r = await get(PATH, { access: "private", useCache: false });
    if (!r || r.statusCode !== 200 || !r.stream) return { bought: {} };
    const j = JSON.parse(await new Response(r.stream).text());
    return { bought: (j && j.bought) || {} };
  } catch (e) { return { bought: {} }; }
}

async function writeState(state) {
  await put(PATH, JSON.stringify(state), {
    access: "private", allowOverwrite: true, addRandomSuffix: false, contentType: "application/json",
  });
}

module.exports = async (req, res) => {
  try {
    if (!isAdmin(req)) return send(res, 401, { error: "Wrong password." });

    if (req.method === "GET") return send(res, 200, await readState());

    if (req.method === "PATCH") {
      const b = await readBody(req);
      const id = String(b.id || "").trim().slice(0, 60);
      if (!id) return send(res, 400, { error: "Missing item." });
      const state = await readState();
      if (b.value) state.bought[id] = true; else delete state.bought[id];
      state.updatedAt = new Date().toISOString();
      await writeState(state);
      return send(res, 200, { ok: true, bought: state.bought });
    }

    return send(res, 405, { error: "method" });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "Something went wrong. Try again in a minute." });
  }
};
