import { db, init } from "./_db.js";
import { isAdmin } from "./_auth.js";

export default async function handler(req, res) {
  try {
    await init();
    if (req.method === "GET") {
      const r = await db.execute("SELECT * FROM products ORDER BY id DESC");
      return res.json(r.rows);
    }
    if (!isAdmin(req)) return res.status(401).json({ error: "Code d'accès invalide" });
    if (req.method === "POST") {
      const { name, price, description, category, image } = req.body;
      if (!name || !price) return res.status(400).json({ error: "Nom et prix requis" });
      await db.execute({ sql: "INSERT INTO products(name,price,description,category,image) VALUES(?,?,?,?,?)",
        args: [name, Number(price), description || "", category || "", image || ""] });
      return res.json({ ok: true });
    }
    if (req.method === "PATCH") {
      const { id, in_stock } = req.body;
      await db.execute({ sql: "UPDATE products SET in_stock=? WHERE id=?", args: [in_stock ? 1 : 0, id] });
      return res.json({ ok: true });
    }
    if (req.method === "DELETE") {
      await db.execute({ sql: "DELETE FROM products WHERE id=?", args: [req.query.id] });
      return res.json({ ok: true });
    }
    res.status(405).end();
  } catch (e) { res.status(500).json({ error: e.message }); }
}
