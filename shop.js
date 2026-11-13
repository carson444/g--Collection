onst WA = "22871048481"; // WhatsApp G Collection
const $ = s => document.querySelector(s);
let products = [], cat = "Tous", cart = {};
try { cart = JSON.parse(localStorage.getItem("gc_cart") || "{}"); } catch {}
const fmt = n => Number(n).toLocaleString("fr-FR") + " FCFA";
const opt = u => u ? u.replace("/upload/", "/upload/f_auto,q_auto,w_700/") : "";

async function load() {
  products = [...(window.FIXED || [])]; render();           // catalogue du fichier products.js
  try {                                                      // + produits ajoutés depuis l'admin
    const r = await fetch("/api/products");
    if (r.ok) { const d = await r.json(); if (Array.isArray(d)) { products = [...products, ...d]; render(); } }
  } catch {}
}
function render() {
  const cats = ["Tous", ...new Set(products.map(p => p.category).filter(Boolean))];
  $("#cats").innerHTML = cats.map(c => `<button class="chip ${c === cat ? "on" : ""}" data-c="${c}">${c}</button>`).join("");
  const list = products.filter(p => cat === "Tous" || p.category === cat);
  $("#grid").innerHTML = list.length ? list.map(p => `<article class="card">
    <div class="ph">${p.image ? `<img src="${opt(p.image)}" alt="${p.name}" loading="lazy">` : ""}${p.in_stock ? "" : '<span class="out">Épuisé</span>'}</div>
    <div class="info"><h3>${p.name}</h3><p>${p.description || ""}</p>
    <div class="row"><b>${fmt(p.price)}</b><button class="btn sm" data-add="${p.id}" ${p.in_stock ? "" : "disabled"}>Ajouter au panier</button></div></div></article>`).join("")
    : `<p class="empty">Les nouveaux pagnes arrivent bientôt.</p>`;
  drawCart();
}
function drawCart() {
  const items = Object.entries(cart).map(([id, q]) => ({ p: products.find(x => x.id == id), q })).filter(i => i.p);
  const total = items.reduce((s, i) => s + i.p.price * i.q, 0);
  $("#n").textContent = items.reduce((s, i) => s + i.q, 0);
  $("#total").textContent = fmt(total);
  $("#lines").innerHTML = items.length ? items.map(({ p, q }) => `<div class="line"><img src="${opt(p.image)}" alt="">
    <div><b>${p.name}</b><small>${fmt(p.price)}</small><div class="meta">
    <div class="qty"><button data-q="${p.id}:-1" aria-label="Moins">−</button>${q}<button data-q="${p.id}:1" aria-label="Plus">+</button></div>
    <button class="rm" data-rm="${p.id}">Retirer</button></div></div></div>`).join("")
    : `<div class="cempty"><h4>Votre panier est vide</h4><p>Choisissez un pagne dans la collection pour commencer.</p></div>`;
  const msg = "Bonjour G Collection, je souhaite commander :\n" + items.map(i => `• ${i.p.name} × ${i.q} = ${fmt(i.p.price * i.q)}`).join("\n") + `\nTotal : ${fmt(total)}`;
  $("#order").href = items.length ? `https://wa.me/${WA}?text=${encodeURIComponent(msg)}` : "#";
  $("#order").style.opacity = items.length ? 1 : .4;
  try { localStorage.setItem("gc_cart", JSON.stringify(cart)); } catch {}
}
const open = b => { $("#drawer").classList.toggle("open", b); $("#veil").classList.toggle("on", b); };
document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.c) { cat = t.dataset.c; render(); }
  if (t.dataset.add) { cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1; drawCart(); open(true); }
  if (t.dataset.q) { const [id, d] = t.dataset.q.split(":"); cart[id] = (cart[id] || 0) + +d; if (cart[id] <= 0) delete cart[id]; drawCart(); }
  if (t.dataset.rm) { delete cart[t.dataset.rm]; drawCart(); }
});
$("#fab").onclick = () => open(true);
$("#close").onclick = $("#veil").onclick = () => open(false);
document.addEventListener("keydown", e => e.key === "Escape" && open(false));
$("#wa").href = `https://wa.me/${WA}`;
load();
