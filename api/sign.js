import crypto from "crypto";
import { isAdmin } from "./_auth.js";

export default function handler(req, res) {
  if (!process.env.ADMIN_CODE) return res.status(500).json({ error: "ADMIN_CODE n'est pas défini dans Vercel (Settings > Environment Variables). Ajoutez-le puis redéployez." });
  if (!isAdmin(req)) return res.status(401).json({ error: "Code d'accès invalide" });
  const timestamp = Math.floor(Date.now() / 1000), folder = "g-collection";
  const signature = crypto.createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`).digest("hex");
  res.json({ timestamp, folder, signature, apiKey: process.env.CLOUDINARY_API_KEY, cloudName: process.env.CLOUDINARY_CLOUD_NAME });
}
