import fs from "fs";
import path from "path";

const storePath = path.join(process.cwd(), "server", "models", "cmsContent.json");

function readAll() {
  try { return JSON.parse(fs.readFileSync(storePath, "utf-8")); } catch { return []; }
}
function writeAll(data) {
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2), "utf-8");
}

export const listContent = async (req, res) => { res.json({ items: readAll() }); };
export const addContent = async (req, res) => {
  const items = readAll();
  const item = { id: Date.now().toString(), ...req.body };
  items.push(item);
  writeAll(items);
  res.json({ ok: true, item });
};
export const updateContent = async (req, res) => {
  const { id } = req.params;
  const items = readAll();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "not found" });
  items[idx] = { ...items[idx], ...req.body };
  writeAll(items);
  res.json({ ok: true, item: items[idx] });
};
