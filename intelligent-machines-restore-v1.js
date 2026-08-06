(() => {
  "use strict";

  const machines = [
    {
      title: "InkLord.ai Ad 01",
      description: "AI-powered tattoo business and client management for independent tattoo artists.",
      type: "Intelligent Machine",
      status: "Active",
      date: "2026",
      mediaType: "youtube",
      youtubeId: "ukh05weY3cA",
      orientation: "vertical"
    },
    {
      title: "ThetaForge Ad 01",
      description: "Self-help software designed to help retrain your brain.",
      type: "Intelligent Machine",
      status: "Completed",
      date: "2026",
      mediaType: "youtube",
      youtubeId: "8TQit9OrlB4",
      orientation: "landscape"
    },
    {
      title: "ThetaForge Ad 02",
      description: "Self-help software designed to help retrain your brain.",
      type: "Intelligent Machine",
      status: "Completed",
      date: "2026",
      mediaType: "youtube",
      youtubeId: "ejvZ1E4X0TI",
      orientation: "vertical"
    },
    {
      title: "ThetaForge White Paper",
      description: "A Self-Voice Guided Neurocognitive Method for Behavioral Repatterning.",
      type: "White Paper",
      status: "Version 1.1",
      date: "March 2026",
      mediaType: "document",
      src: "content/machines/ThetaForge%20White%20Paper.pdf"
    }
  ];

  const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);

  const installStyles = () => {
    if (document.getElementById("pb-machines-restore-styles-v1")) return;
    const style = document.createElement("style");
    style.id = "pb-machines-restore-styles-v1";
    style.textContent = `
      #machine-grid.pb-machines-owned {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 24px !important;
        align-items: start !important;
      }
      #machine-grid.pb-machines-owned > .machine-card {
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        overflow: hidden !important;
      }
      #machine-grid .pb-machine-preview {
        position: relative !important;
        width: 100% !important;
        background: #000 !important;
        overflow: hidden !important;
        border-bottom: 1px solid var(--line, rgba(255,255,255,.12));
      }
      #machine-grid .pb-machine-preview.is-landscape { aspect-ratio: 16 / 9 !important; }
      #machine-grid .pb-machine-preview.is-vertical {
        width: min(46%, 250px) !important;
        max-width: 250px !important;
        aspect-ratio: 9 / 16 !important;
        margin: 0 auto !important;
      }
      #machine-grid .pb-machine-poster,
      #machine-grid .pb-machine-preview iframe {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        border: 0 !important;
      }
      #machine-grid .pb-machine-poster {
        z-index: 30 !important;
        display: block !important;
        padding: 0 !important;
        cursor: pointer !important;
        overflow: hidden !important;
        background: #000 !important;
      }
      #machine-grid .pb-machine-poster img {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        object-position: center !important;
        -webkit-user-drag: none !important;
        user-select: none !important;
      }
      #machine-grid .pb-machine-poster::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 2;
        background: linear-gradient(to top, rgba(0,0,0,.52), transparent 50%),
                    linear-gradient(to bottom, rgba(0,0,0,.3), transparent 35%);
      }
      #machine-grid .pb-machine-play {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 4;
        width: 64px;
        height: 64px;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
        border: 1px solid rgba(205,158,91,.9);
        border-radius: 50%;
        color: #fff4e3;
        background: rgba(5,5,5,.84);
        font: 24px/1 Arial,sans-serif;
        padding-left: 4px;
        box-shadow: 0 10px 30px rgba(0,0,0,.58);
      }
      #machine-grid .pb-machine-document {
        min-height: 260px;
        display: grid;
        place-items: center;
        padding: 32px;
        background:
          radial-gradient(circle at 50% 35%, rgba(145,30,22,.23), transparent 42%),
          linear-gradient(145deg, #0b0b0b, #020202);
        border-bottom: 1px solid var(--line, rgba(255,255,255,.12));
      }
      #machine-grid .pb-machine-document span {
        width: 98px;
        height: 128px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(205,158,91,.62);
        color: #e7dcc7;
        letter-spacing: .18em;
        font-size: .78rem;
        background: rgba(0,0,0,.55);
      }
      #machine-grid .pb-machine-copy { padding: 22px !important; }
      #machine-grid .pb-machine-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        margin: 12px 0 16px;
        color: var(--muted, #9e9589);
        font-size: .78rem;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      @media (max-width: 760px) {
        #machine-grid.pb-machines-owned { grid-template-columns: minmax(0, 1fr) !important; }
        #machine-grid .pb-machine-preview.is-vertical {
          width: min(68%, 280px) !important;
          max-width: 280px !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const render = () => {
    const grid = document.getElementById("machine-grid");
    if (!grid) return false;

    grid.dataset.pbMachinesOwner = "intelligent-machines-v1";
    grid.classList.add("pb-machines-owned");
    grid.innerHTML = machines.map((item, index) => {
      const number = String(index + 1).padStart(2, "0");
      const meta = `${item.date ? `<span>${esc(item.date)}</span>` : ""}${item.status ? `<span>${esc(item.status)}</span>` : ""}`;

      if (item.mediaType === "youtube") {
        const id = esc(item.youtubeId);
        const orientation = item.orientation === "vertical" ? "vertical" : "landscape";
        return `<article class="machine-card manifest-machine-card reveal visible is-youtube-card${orientation === "vertical" ? " is-vertical-card" : ""}">
          <div class="pb-machine-preview is-${orientation}" data-youtube-id="${id}">
            <button class="pb-machine-poster" type="button" aria-label="Play ${esc(item.title)}">
              <img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg';" alt="Poster frame from ${esc(item.title)}" draggable="false">
              <span class="pb-machine-play" aria-hidden="true">▶</span>
            </button>
          </div>
          <div class="pb-machine-copy">
            <span class="machine-index">${number}</span>
            <span class="eyebrow">${esc(item.type)}</span>
            <h3>${esc(item.title)}</h3>
            ${item.description ? `<p>${esc(item.description)}</p>` : ""}
            <div class="pb-machine-meta">${meta}</div>
          </div>
        </article>`;
      }

      return `<article class="machine-card manifest-machine-card reveal visible">
        <a class="pb-machine-document" href="${esc(item.src)}" target="_blank" rel="noopener" aria-label="Open ${esc(item.title)}"><span>PDF</span></a>
        <div class="pb-machine-copy">
          <span class="machine-index">${number}</span>
          <span class="eyebrow">${esc(item.type)}</span>
          <h3>${esc(item.title)}</h3>
          ${item.description ? `<p>${esc(item.description)}</p>` : ""}
          <div class="pb-machine-meta">${meta}</div>
          <a class="text-link" href="${esc(item.src)}" target="_blank" rel="noopener">Open white paper <span>→</span></a>
        </div>
      </article>`;
    }).join("");

    grid.querySelectorAll(".pb-machine-poster").forEach((button) => {
      button.addEventListener("click", () => {
        const wrapper = button.closest(".pb-machine-preview");
        const id = wrapper?.dataset.youtubeId;
        if (!wrapper || !id) return;

        const iframe = document.createElement("iframe");
        const url = new URL(`https://www.youtube.com/embed/${encodeURIComponent(id)}`);
        url.searchParams.set("autoplay", "1");
        url.searchParams.set("rel", "0");
        url.searchParams.set("playsinline", "1");
        if (location.protocol === "http:" || location.protocol === "https:") {
          url.searchParams.set("origin", location.origin);
        }
        iframe.src = url.href;
        iframe.title = button.getAttribute("aria-label") || "YouTube video";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        wrapper.replaceChildren(iframe);
      }, { once: true });
    });

    return true;
  };

  const start = () => {
    installStyles();
    let repairing = false;
    const ensure = () => {
      if (repairing) return;
      const grid = document.getElementById("machine-grid");
      if (!grid) return;
      const owned = grid.dataset.pbMachinesOwner === "intelligent-machines-v1";
      const count = grid.querySelectorAll(":scope > .machine-card").length;
      if (!owned || count !== machines.length) {
        repairing = true;
        render();
        queueMicrotask(() => { repairing = false; });
      }
    };

    ensure();
    const observer = new MutationObserver(ensure);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    let checks = 0;
    const guard = setInterval(() => {
      ensure();
      checks += 1;
      if (checks >= 20) clearInterval(guard);
    }, 500);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
