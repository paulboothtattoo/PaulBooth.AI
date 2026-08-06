(() => {
  "use strict";

  const motionItems = [
    { title: "Sweetness", description: "A story about an old man and his decaying relationship with his granddaughter.", type: "Motion", status: "Completed", date: "2026", youtubeId: "GZifBUkfaNQ", posterKey: "sweetness", videoOrientation: "landscape" },
    { title: "Sindy BOOK Ad 01", description: "", type: "Motion", status: "", date: "", youtubeId: "8j-BDQW0nLA", posterKey: "sindy", videoOrientation: "landscape" },
    { title: "Memento Mori", description: "", type: "Motion", status: "", date: "", youtubeId: "66Mop21TKcg", posterKey: "memento", videoOrientation: "landscape" },
    { title: "Walker", description: "", type: "Motion", status: "", date: "", youtubeId: "fkd1w2lhSv4", posterKey: "walker", videoOrientation: "vertical" },
    { title: "Mephisto", description: "", type: "Motion", status: "", date: "", youtubeId: "-NRropwmnJ8", posterKey: "mephisto", videoOrientation: "vertical" },
    { title: "Zion Lost", description: "A unified archive for the debut video, full album playlist, and visual photography created around the band.", type: "Band / Music / Film", status: "Active", date: "2026", youtubeId: "qazeawsKeQE", posterKey: "zion", videoOrientation: "landscape", link: "projects/babylon-black/index.html" }
  ];

  const esc = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[c]);

  const installStyles = () => {
    if (document.getElementById("pb-motion-poster-v5-styles")) return;
    const style = document.createElement("style");
    style.id = "pb-motion-poster-v5-styles";
    style.textContent = `
      #motion-project-grid { min-height: 0 !important; }
      #motion-project-grid .motion-folder-card.is-youtube-card { overflow: hidden; }
      #motion-project-grid .motion-folder-preview.is-youtube-preview {
        position: relative !important; display: block !important; width: 100% !important;
        height: auto !important; min-height: 0 !important; max-height: none !important;
        aspect-ratio: auto !important; overflow: visible !important; padding: 0 !important;
        background: #000 !important;
      }
      #motion-project-grid .pb-youtube-embed {
        position: relative !important; display: block !important; overflow: hidden !important;
        background: #000 !important; width: 100% !important; margin: 0 auto !important;
      }
      #motion-project-grid .pb-youtube-embed.is-landscape { aspect-ratio: 16 / 9 !important; }
      #motion-project-grid .pb-youtube-embed.is-vertical {
        width: min(46%, 250px) !important; max-width: 250px !important; aspect-ratio: 9 / 16 !important;
      }
      #motion-project-grid .pb-youtube-poster,
      #motion-project-grid .pb-youtube-embed iframe {
        position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; border: 0 !important;
      }
      #motion-project-grid .pb-youtube-poster {
        display: block !important; padding: 0 !important; border: 0 !important; cursor: pointer !important;
        background: #000 !important; overflow: hidden !important;
      }
      #motion-project-grid .pb-youtube-poster img {
        display: block !important; width: 100% !important; height: 100% !important;
        object-fit: cover !important; object-position: center !important; user-select: none !important; -webkit-user-drag: none !important;
      }
      #motion-project-grid .pb-youtube-poster::after {
        content: "▶"; position: absolute; right: 14px; bottom: 14px; z-index: 10000;
        width: 42px; height: 42px; display: grid; place-items: center;
        border: 1px solid rgba(205,158,91,.86); border-radius: 50%; color: #fff4e3;
        background: rgba(5,5,5,.86); font: 18px/1 Arial,sans-serif; padding-left: 2px;
        box-shadow: 0 8px 24px rgba(0,0,0,.5);
      }
      #motion-project-grid .pb-youtube-poster-frame {
        position: absolute !important; inset: 0 !important; z-index: 9999 !important;
        display: block !important; width: 100% !important; height: 100% !important;
        padding: 0 !important; border: 0 !important; cursor: pointer !important;
        background: #000 !important; overflow: hidden !important;
      }
      #motion-project-grid .pb-youtube-poster-frame img {
        position: absolute !important; inset: 0 !important;
        display: block !important; width: 100% !important; height: 100% !important;
        object-fit: cover !important; object-position: center !important;
        user-select: none !important; -webkit-user-drag: none !important;
      }
      #motion-project-grid .pb-youtube-poster-frame::before {
        content: ""; position: absolute; inset: 0; z-index: 2;
        background: linear-gradient(to top, rgba(0,0,0,.48), transparent 45%),
                    linear-gradient(to bottom, rgba(0,0,0,.28), transparent 32%);
      }
      #motion-project-grid .pb-custom-play {
        position: absolute; left: 50%; top: 50%; z-index: 10000;
        width: 64px; height: 64px; transform: translate(-50%, -50%);
        display: grid; place-items: center; border: 1px solid rgba(205,158,91,.9);
        border-radius: 50%; color: #fff4e3; background: rgba(5,5,5,.82);
        font: 24px/1 Arial,sans-serif; padding-left: 4px;
        box-shadow: 0 10px 30px rgba(0,0,0,.58); backdrop-filter: blur(6px);
      }
      #motion-project-grid .motion-folder-index { z-index: 9999 !important; }
      @media (max-width: 760px) {
        #motion-project-grid .pb-youtube-embed.is-vertical { width: min(68%, 280px) !important; max-width: 280px !important; }
      }
    `;
    document.head.appendChild(style);
  };

  const render = () => {
    document.documentElement.dataset.pbMotionPosterVersion = "v5-external-youtube";
    const grid = document.getElementById("motion-project-grid");
    const empty = document.getElementById("motion-project-empty");
    if (!grid) return false;

    grid.dataset.pbMotionOwner = "youtube-posters-v5-external-youtube";
    grid.innerHTML = motionItems.map((item, index) => {
      const id = esc(item.youtubeId);
      const orientation = item.videoOrientation === "vertical" ? "vertical" : "landscape";
      const projectLink = item.link ? `<a class="text-link" href="${esc(item.link)}">Open project <span>→</span></a>` : "";
      return `<article class="motion-folder-card reveal visible is-youtube-card${orientation === "vertical" ? " is-vertical-card" : ""}">
        <div class="motion-folder-preview is-youtube-preview">
          <span class="motion-folder-index">${String(index + 1).padStart(2, "0")}</span>
          <div class="pb-youtube-embed is-${orientation}" data-youtube-id="${id}">
            <button class="pb-youtube-poster-frame" type="button" aria-label="Play ${esc(item.title)}">
              <img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg';" alt="Poster frame from ${esc(item.title)}" draggable="false">
              <span class="pb-custom-play" aria-hidden="true">▶</span>
            </button>
          </div>
        </div>
        <div class="motion-folder-copy">
          <span class="eyebrow">${esc(item.type || "Motion")}</span>
          <h3>${esc(item.title)}</h3>
          ${item.description ? `<p>${esc(item.description)}</p>` : ""}
          ${(item.date || item.status) ? `<div class="motion-folder-meta">${item.date ? `<span>${esc(item.date)}</span>` : ""}${item.status ? `<span>${esc(item.status)}</span>` : ""}</div>` : ""}
          ${projectLink}
        </div>
      </article>`;
    }).join("");

    grid.querySelectorAll(".pb-youtube-poster-frame").forEach((button) => {
      button.addEventListener("click", () => {
        const wrapper = button.closest(".pb-youtube-embed");
        const id = wrapper?.dataset.youtubeId;
        if (!id) return;
        window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`, "_blank", "noopener,noreferrer");
      });
    });

    if (empty) empty.hidden = true;
    return true;
  };

  const start = () => {
    installStyles();

    let repairing = false;
    const ensureRendered = () => {
      if (repairing) return;
      const grid = document.getElementById("motion-project-grid");
      if (!grid) return;
      const owned = grid.dataset.pbMotionOwner === "youtube-posters-v5-external-youtube";
      const count = grid.querySelectorAll(":scope > .motion-folder-card.is-youtube-card").length;
      if (!owned || count !== motionItems.length) {
        repairing = true;
        render();
        queueMicrotask(() => { repairing = false; });
      }
    };

    ensureRendered();

    const observer = new MutationObserver(() => ensureRendered());
    observer.observe(document.documentElement, { childList: true, subtree: true });

    let checks = 0;
    const guard = setInterval(() => {
      ensureRendered();
      checks += 1;
      if (checks >= 20) clearInterval(guard);
    }, 500);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
