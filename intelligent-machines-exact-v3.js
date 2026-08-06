(() => {
  "use strict";

  const BUILD = "pb-intelligent-machines-exact-v3-20260805-2325";
  const items = [
    { title: "InkLord.ai Ad 01", description: "AI-powered tattoo business and client management for independent tattoo artists.", type: "Intelligent Machine", status: "Active", date: "2026", youtubeId: "ukh05weY3cA", orientation: "vertical" },
    { title: "ThetaForge Ad 01", description: "Self-help software designed to help retrain your brain.", type: "Intelligent Machine", status: "Completed", date: "2026", youtubeId: "8TQit9OrlB4", orientation: "landscape" },
    { title: "ThetaForge Ad 02", description: "Self-help software designed to help retrain your brain.", type: "Intelligent Machine", status: "Completed", date: "2026", youtubeId: "ejvZ1E4X0TI", orientation: "vertical" },
    { title: "ThetaForge White Paper", description: "A Self-Voice Guided Neurocognitive Method for Behavioral Repatterning.", type: "White Paper", status: "Version 1.1", date: "March 2026", src: "content/machines/ThetaForge%20White%20Paper.pdf" }
  ];

  const esc = (value = "") => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);

  function installStyles() {
    if (document.getElementById(BUILD)) return;
    const style = document.createElement("style");
    style.id = BUILD;
    style.textContent = `
      #machine-grid.pb-exact-machines { display:grid!important; grid-template-columns:repeat(2,minmax(0,1fr))!important; gap:24px!important; align-items:start!important; }
      #machine-grid.pb-exact-machines>.machine-card { width:100%!important; min-width:0!important; max-width:none!important; overflow:hidden!important; }
      #machine-grid .pb-exact-preview { position:relative!important; width:100%!important; overflow:hidden!important; background:#000!important; border-bottom:1px solid var(--line,rgba(255,255,255,.12)); }
      #machine-grid .pb-exact-preview.landscape { aspect-ratio:16/9!important; }
      #machine-grid .pb-exact-preview.vertical { width:min(46%,250px)!important; max-width:250px!important; aspect-ratio:9/16!important; margin:0 auto!important; }
      #machine-grid .pb-exact-poster { position:absolute!important; inset:0!important; display:block!important; width:100%!important; height:100%!important; padding:0!important; border:0!important; overflow:hidden!important; cursor:pointer!important; background:#000!important; }
      #machine-grid .pb-exact-poster img { position:absolute!important; inset:0!important; width:100%!important; height:100%!important; object-fit:cover!important; object-position:center!important; user-select:none!important; -webkit-user-drag:none!important; }
      #machine-grid .pb-exact-poster:before { content:""; position:absolute; inset:0; z-index:2; background:linear-gradient(to top,rgba(0,0,0,.48),transparent 48%),linear-gradient(to bottom,rgba(0,0,0,.24),transparent 32%); }
      #machine-grid .pb-exact-play { position:absolute; left:50%; top:50%; z-index:4; width:64px; height:64px; transform:translate(-50%,-50%); display:grid; place-items:center; border:1px solid rgba(205,158,91,.92); border-radius:50%; background:rgba(5,5,5,.86); color:#fff4e3; font:24px/1 Arial,sans-serif; padding-left:4px; box-shadow:0 10px 30px rgba(0,0,0,.58); }
      #machine-grid .pb-exact-copy { padding:22px!important; }
      #machine-grid .pb-exact-meta { display:flex; flex-wrap:wrap; gap:8px 14px; margin:12px 0 16px; color:var(--muted,#9e9589); font-size:.78rem; letter-spacing:.08em; text-transform:uppercase; }
      #machine-grid .pb-exact-document { min-height:260px; display:grid; place-items:center; padding:32px; background:radial-gradient(circle at 50% 35%,rgba(145,30,22,.23),transparent 42%),linear-gradient(145deg,#0b0b0b,#020202); border-bottom:1px solid var(--line,rgba(255,255,255,.12)); text-decoration:none; }
      #machine-grid .pb-exact-document span { width:98px; height:128px; display:grid; place-items:center; border:1px solid rgba(205,158,91,.62); color:#e7dcc7; letter-spacing:.18em; font-size:.78rem; background:rgba(0,0,0,.55); }
      @media(max-width:760px){ #machine-grid.pb-exact-machines{grid-template-columns:minmax(0,1fr)!important;} #machine-grid .pb-exact-preview.vertical{width:min(68%,280px)!important;max-width:280px!important;} }
    `;
    document.head.appendChild(style);
  }

  function render() {
    const grid = document.getElementById("machine-grid");
    if (!grid) return false;
    grid.dataset.pbExactOwner = BUILD;
    grid.className = "machine-grid pb-exact-machines";
    grid.innerHTML = items.map((item, index) => {
      const number = String(index + 1).padStart(2,"0");
      const meta = `${item.date ? `<span>${esc(item.date)}</span>` : ""}${item.status ? `<span>${esc(item.status)}</span>` : ""}`;
      if (item.youtubeId) {
        const id = esc(item.youtubeId);
        const orientation = item.orientation === "vertical" ? "vertical" : "landscape";
        return `<article class="machine-card reveal visible">
          <div class="pb-exact-preview ${orientation}">
            <a class="pb-exact-poster" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${esc(item.title)} on YouTube">
              <img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg';" alt="Poster frame from ${esc(item.title)}" draggable="false">
              <span class="pb-exact-play" aria-hidden="true">▶</span>
            </a>
          </div>
          <div class="pb-exact-copy"><span class="machine-index">${number}</span><span class="eyebrow">${esc(item.type)}</span><h3>${esc(item.title)}</h3>${item.description?`<p>${esc(item.description)}</p>`:""}<div class="pb-exact-meta">${meta}</div><a class="text-link" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">Watch video <span>→</span></a></div>
        </article>`;
      }
      return `<article class="machine-card reveal visible"><a class="pb-exact-document" href="${esc(item.src)}" target="_blank" rel="noopener"><span>PDF</span></a><div class="pb-exact-copy"><span class="machine-index">${number}</span><span class="eyebrow">${esc(item.type)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="pb-exact-meta">${meta}</div><a class="text-link" href="${esc(item.src)}" target="_blank" rel="noopener">Open white paper <span>→</span></a></div></article>`;
    }).join("");
    return true;
  }

  function start() {
    installStyles();
    let locked = false;
    const ensure = () => {
      if (locked) return;
      const grid = document.getElementById("machine-grid");
      if (!grid) return;
      if (grid.dataset.pbExactOwner !== BUILD || grid.children.length !== items.length) {
        locked = true; render(); queueMicrotask(() => { locked = false; });
      }
    };
    ensure();
    new MutationObserver(ensure).observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(ensure,250); setTimeout(ensure,1000); setTimeout(ensure,2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true}); else start();
})();
