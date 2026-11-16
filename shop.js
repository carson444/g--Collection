const WA = "22871048481"; // WhatsApp G Collection
const $ = s => document.querySelector(s);
let products = [], cat = "Tous", cart = {};
try { cart = JSON.parse(localStorage.getItem("gc_cart") || "{}"); } catch {}
const fmt = n => Number(n).toLocaleString("fr-FR") + " FCFA";
const opt = u => u ? u.replace("/upload/", "/upload/f_auto,q_auto,w_800/") : "";
const abs = u => { if (!u) return ""; const x = u.replace("/upload/", "/upload/w_900,c_limit,q_auto/"); try { return new URL(x, location.href).href; } catch { return x; } };
const DOT = { Bleus: "#1F4FC4", Verts: "#0F8A6B", "Tons chauds": "#C8502D" };
const io = window.IntersectionObserver ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 }) : null;
const reveal = () => document.querySelectorAll(".rv:not(.in)").forEach(c => io ? io.observe(c) : c.classList.add("in"));

async function load() {
  products = [...(window.FIXED || [])]; render();
  try { const r = await fetch("/api/products"); if (r.ok) { const d = await r.json(); if (Array.isArray(d)) { products = [...products, ...d]; render(); } } } catch {}
}
function render() {
  const cats = ["Tous", ...new Set(products.map(p => p.category).filter(Boolean))];
  $("#cats").innerHTML = cats.map(c => `<button class="chip ${c === cat ? "on" : ""}" data-c="${c}"><i style="${DOT[c] ? "background:" + DOT[c] : ""}"></i>${c}</button>`).join("");
  const list = products.filter(p => cat === "Tous" || p.category === cat);
  $("#grid").innerHTML = list.length ? list.map((p, i) => `<article class="card rv" data-open="${p.id}">
    <div class="ph2">${p.image ? `<img src="${opt(p.image)}" alt="${p.name}" loading="lazy">` : ""}${p.in_stock ? "" : '<span class="out">ÉPUISÉ</span>'}</div>
    <div class="meta"><div><small class="num">${String(i + 1).padStart(2, "0")}</small><h3>${p.name}</h3></div><span class="pr">${fmt(p.price)}</span></div>
    <button class="btn sm" data-add="${p.id}" ${p.in_stock ? "" : "disabled"}>Ajouter au panier</button></article>`).join("")
    : `<p class="empty">Les nouveaux pagnes arrivent bientôt.</p>`;
  reveal(); drawCart();
}
function msg(items) {
  const total = items.reduce((s, i) => s + i.p.price * i.q, 0);
  return "Bonjour G Collection, je souhaite commander :\n\n" + items.map((i, k) => `${k + 1}) ${i.p.name} × ${i.q} — ${fmt(i.p.price * i.q)}\nPhoto : ${abs(i.p.image)}`).join("\n\n") + `\n\nTotal : ${fmt(total)}`;
}
const wa = items => `https://wa.me/${WA}?text=${encodeURIComponent(msg(items))}`;
function drawCart() {
  const items = Object.entries(cart).map(([id, q]) => ({ p: products.find(x => x.id == id), q })).filter(i => i.p);
  $("#n").textContent = items.reduce((s, i) => s + i.q, 0);
  $("#total").textContent = fmt(items.reduce((s, i) => s + i.p.price * i.q, 0));
  $("#lines").innerHTML = items.length ? items.map(({ p, q }) => `<div class="line"><img src="${opt(p.image)}" alt="">
    <div><b>${p.name}</b><small>${fmt(p.price)} × ${q}</small><div class="meta2"><div class="qty"><button data-q="${p.id}:-1" aria-label="Moins">−</button>${q}<button data-q="${p.id}:1" aria-label="Plus">+</button></div><button class="rm" data-rm="${p.id}">Retirer</button></div></div><div class="lt">${fmt(p.price * q)}</div></div>`).join("")
    : `<div class="cempty"><h4>Votre panier est vide</h4><p>Choisissez un pagne dans la collection pour commencer.</p></div>`;
  $("#order").href = items.length ? wa(items) : "#"; $("#order").style.opacity = items.length ? 1 : .4;
  try { localStorage.setItem("gc_cart", JSON.stringify(cart)); } catch {}
}
const drawer = b => { $("#drawer").classList.toggle("open", b); $("#veil").classList.toggle("on", b); };
function openModal(id) {
  const p = products.find(x => x.id == id); if (!p) return;
  $("#mimg").src = opt(p.image); $("#mimg").alt = p.name; $("#mcat").textContent = (p.category || "PAGNE D'ART AFRICAIN").toUpperCase();
  $("#mname").textContent = p.name; $("#mprice").textContent = fmt(p.price) + " · pièce de 6 yards"; $("#mdesc").textContent = p.description || "";
  $("#madd").dataset.add = p.id; $("#madd").disabled = !p.in_stock; $("#mwa").href = wa([{ p, q: 1 }]);
  $("#modal").classList.add("on");
}
const closeModal = () => $("#modal").classList.remove("on");
document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.c) { cat = t.dataset.c; render(); return; }
  if (t.dataset.add) { cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1; drawCart(); closeModal(); drawer(true); return; }
  if (t.dataset.q) { const [id, d] = t.dataset.q.split(":"); cart[id] = (cart[id] || 0) + +d; if (cart[id] <= 0) delete cart[id]; drawCart(); return; }
  if (t.dataset.rm) { delete cart[t.dataset.rm]; drawCart(); return; }
  if (t.hasAttribute("data-close")) { closeModal(); return; }
  const c = t.closest("[data-open]"); if (c) openModal(c.dataset.open);
});
$("#fab").onclick = () => drawer(true);
$("#close").onclick = $("#veil").onclick = () => drawer(false);
document.addEventListener("keydown", e => { if (e.key === "Escape") { drawer(false); closeModal(); } });
$("#wa").href = `https://wa.me/${WA}`;
function heroInit() {
  const S = (window.FIXED || []).filter(p => p.image); if (S.length < 2) return;
  const ph = document.querySelector(".hero .ph"), dots = $("#hdots"), pad = n => String(n).padStart(2, "0"); let cur = 0, t;
  ph.querySelectorAll("img.s").forEach(i => i.remove());
  const imgs = S.map((p, i) => { const im = new Image(); im.className = "s"; im.src = p.image; im.alt = p.name; ph.insertBefore(im, ph.firstChild);
    const d = document.createElement("button"); d.setAttribute("aria-label", p.name); d.onclick = () => go(i); dots.appendChild(d); return im; });
  $("#ht").textContent = pad(S.length);
  function go(i) {
    clearTimeout(t); cur = i;
    imgs.forEach((im, j) => im.classList.toggle("on", j === i));
    [...dots.children].forEach((d, j) => { d.classList.remove("on", "done"); if (j < i) d.classList.add("done"); });
    void dots.offsetWidth; dots.children[i].classList.add("on");
    $("#hn").textContent = pad(i + 1); $("#hname").textContent = S[i].name;
    t = setTimeout(() => go((i + 1) % S.length), 5500);
  }
  $("#hopen").onclick = () => openModal(S[cur].id); go(0);
}
addEventListener("scroll", () => { const h = document.documentElement; $("#prog").style.transform = `scaleX(${h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)})`; }, { passive: true });
reveal(); load(); heroInit();
