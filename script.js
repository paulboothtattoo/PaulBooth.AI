// Manifest-driven media system.
// The same content/motion records power both Motion Systems and Content Repository.
(() => {
  "use strict";

  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);

  const normalizeItem = (item) => ({
    ...item,
    category: String(item.category || "").toLowerCase(),
    mediaType: String(item.mediaType || "").toLowerCase(),
    title: item.title || item.filename || "Untitled",
    src: item.src || "",
    type: item.type || item.categoryLabel || "Motion",
    videoOrientation: String(item.videoOrientation || "landscape").toLowerCase() === "vertical"
      ? "vertical"
      : "landscape"
  });

  const fetchManifestItems = async () => {
    const manifestUrl = new URL("content-manifest.json", document.baseURI);
    manifestUrl.searchParams.set("cache", Date.now().toString());

    const response = await fetch(manifestUrl.href, {
      cache: "no-store",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`content-manifest.json returned HTTP ${response.status}`);
    }

    const payload = await response.json();

    if (!payload || !Array.isArray(payload.items)) {
      throw new Error("content-manifest.json does not contain a valid items array");
    }

    return payload.items
      .map(normalizeItem)
      .filter((item) => item.src || item.youtubeId || item.embedUrl);
  };

  const videoMarkup = (item) => {
    const src = escapeHtml(item.src);
    const poster = item.poster ? ` poster="${escapeHtml(item.poster)}"` : "";
    return `<video controls controlsList="nodownload noremoteplayback" disablePictureInPicture disableremoteplayback preload="metadata" playsinline oncontextmenu="return false;"${poster}>
      <source src="${src}" type="video/mp4">
      Your browser does not support embedded video.
    </video>`;
  };

  const youtubeMarkup = (item) => {
    const videoId = escapeHtml(item.youtubeId || "");
    const orientationClass = item.videoOrientation === "vertical" ? " is-vertical" : " is-landscape";

    return `<div class="pb-youtube-embed${orientationClass}">
      <iframe
        src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1"
        title="${escapeHtml(item.title || "Embedded video")}"
        loading="lazy"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen></iframe>
    </div>`;
  };

  const installMachineStyles = () => {
    if (document.querySelector("#manifest-machine-styles")) return;
    const style = document.createElement("style");
    style.id = "manifest-machine-styles";
    style.textContent = `
      .manifest-machine-card { display:flex; flex-direction:column; overflow:hidden; }
      .manifest-machine-preview { background:#000; border-bottom:1px solid rgba(169,119,67,.28); }
      .manifest-machine-preview:not(.is-youtube-preview) { aspect-ratio:16/9; }
      .manifest-machine-preview.is-youtube-preview { aspect-ratio:auto; height:auto; min-height:0; overflow:visible; display:block; }
      .manifest-machine-preview video { display:block; width:100%; height:100%; object-fit:contain; background:#000; }
      .manifest-machine-card .machine-index { margin-bottom:14px; }
    `;
    document.head.appendChild(style);
  };


  const enableLazyVideoPreviews = (root = document) => {
    const videos = Array.from(root.querySelectorAll("video")).filter(
      (video) => !video.dataset.previewReady
    );

    videos.forEach((video) => {
      video.dataset.previewReady = "true";
      video.preload = "metadata";

      if (video.hasAttribute("poster")) return;

      const generatePoster = () => {
        if (video.dataset.posterGenerating === "true") return;
        video.dataset.posterGenerating = "true";

        const captureFrame = () => {
          try {
            if (!video.videoWidth || !video.videoHeight) {
              throw new Error("Video dimensions are not available.");
            }

            const canvas = document.createElement("canvas");
            const maxWidth = 960;
            const scale = Math.min(1, maxWidth / video.videoWidth);
            canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
            canvas.height = Math.max(1, Math.round(video.videoHeight * scale));

            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const posterDataUrl = canvas.toDataURL("image/jpeg", 0.82);
            video.poster = posterDataUrl;
            video.dataset.generatedPoster = "true";
            video.pause();
          } catch (error) {
            console.warn("[PB_CONTENT] Could not generate video poster:", error);
          } finally {
            video.dataset.posterGenerating = "false";
          }
        };

        const seekToPreviewFrame = () => {
          const duration = Number.isFinite(video.duration) ? video.duration : 0;
          const previewFrame = 10 + Math.floor(Math.random() * 11);
          const previewTimeAt30Fps = previewFrame / 30;
          const targetTime = duration > previewTimeAt30Fps
            ? Math.min(previewTimeAt30Fps, Math.max(0.05, duration - 0.05))
            : Math.max(0.01, duration * 0.5);

          video.dataset.previewFrame = String(previewFrame);
          video.addEventListener("seeked", captureFrame, { once: true });

          try {
            video.currentTime = targetTime;
          } catch (error) {
            console.warn("[PB_CONTENT] Could not seek video for poster:", error);
            video.dataset.posterGenerating = "false";
          }
        };

        if (video.readyState >= 1) {
          seekToPreviewFrame();
        } else {
          video.addEventListener("loadedmetadata", seekToPreviewFrame, { once: true });
          video.load();
        }
      };

      const observer = new IntersectionObserver((entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          generatePoster();
          instance.unobserve(video);
        });
      }, { rootMargin: "240px 0px", threshold: 0.01 });

      observer.observe(video);
    });
  };

  const videoPreviewObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches("video") || node.querySelector("video")) {
          enableLazyVideoPreviews(node.matches("video") ? node.parentElement : node);
        }
      });
    });
  });

  const renderMotionSystems = (items) => {
    const grid = document.querySelector("#motion-project-grid");
    const empty = document.querySelector("#motion-project-empty");
    if (!grid || !empty) return;

    const motionItems = items.filter(
      (item) => item.category === "motion" && (item.mediaType === "video" || item.mediaType === "youtube")
    );

    grid.innerHTML = motionItems.map((item, index) => {
      const directLink = escapeHtml(item.link || item.src || "");
      const actionLabel = item.link
        ? "Open project"
        : item.mediaType === "document"
          ? "Open white paper"
          : item.mediaType === "video"
            ? "Open video"
            : "Open file";

      const orientation = item.videoOrientation === "vertical" ? "vertical" : "landscape";
      const mediaClasses = item.mediaType === "youtube"
        ? ` is-youtube-card is-${orientation}-card`
        : "";
      const previewClasses = item.mediaType === "youtube"
        ? ` is-youtube-preview is-${orientation}-preview`
        : "";

      return `<article class="motion-folder-card reveal visible${mediaClasses}">
        <div class="motion-folder-preview${previewClasses}">
          <span class="motion-folder-index">${String(index + 1).padStart(2, "0")}</span>
          ${item.mediaType === "youtube" ? youtubeMarkup(item) : videoMarkup(item)}
        </div>
        <div class="motion-folder-copy">
          <span class="eyebrow">${escapeHtml(item.type)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
          ${(item.date || item.status) ? `<div class="motion-folder-meta">
            ${item.date ? `<span>${escapeHtml(item.date)}</span>` : ""}
            ${item.status ? `<span>${escapeHtml(item.status)}</span>` : ""}
          </div>` : ""}
          ${directLink ? `<a class="text-link" href="${directLink}" target="_self" rel="noopener">${actionLabel} <span>→</span></a>` : ""}
        </div>
      </article>`;
    }).join("");

    empty.hidden = motionItems.length > 0;
  };
  const renderIntelligentMachines = (items) => {
    const grid = document.querySelector("#machine-grid");
    if (!grid) return;

    const machineItems = items.filter((item) => item.category === "machines");

    grid.innerHTML = machineItems.map((item, index) => {
      const directLink = item.link ? escapeHtml(item.link) : "";
      const actionLabel = item.link ? "Open project" : "";

      const preview = item.mediaType === "youtube"
        ? youtubeMarkup(item)
        : item.mediaType === "video"
          ? videoMarkup(item)
          : item.mediaType === "image"
          ? `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}" loading="lazy">`
          : `<div class="folder-document">${escapeHtml((item.mediaType || "file").toUpperCase())}</div>`;

      const orientation = item.videoOrientation === "vertical" ? "vertical" : "landscape";
      const mediaClasses = item.mediaType === "youtube"
        ? ` is-youtube-card is-${orientation}-card`
        : "";
      const previewClasses = item.mediaType === "youtube"
        ? ` is-youtube-preview is-${orientation}-preview`
        : "";

      return `<article class="machine-card manifest-machine-card reveal visible${mediaClasses}">
        <div class="manifest-machine-preview${previewClasses}">
          ${preview}
        </div>
        <span class="machine-index">${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(item.title)}</h3>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
        ${directLink ? `<a href="${directLink}" target="_self" rel="noopener">${actionLabel} <span>→</span></a>` : ""}
      </article>`;
    }).join("");
  };

  const renderRepository = (items) => {
    const grid = document.querySelector("#folder-media-grid");
    const tabs = document.querySelector("#folder-tabs");
    const empty = document.querySelector("#folder-empty");
    if (!grid || !tabs || !empty) return;

    const categories = [
      ["all", "All Files"],
      ["ai-platforms", "AI Platforms"],
      ["visual-work", "Visual Work"],
      ["motion", "Motion"],
      ["research", "Research"],
      ["machines", "Machines"]
    ];

    let activeCategory = "all";

    const previewMarkup = (item) => {
      const src = escapeHtml(item.src);
      const title = escapeHtml(item.title);

      if (item.mediaType === "image") {
        return `<img src="${src}" alt="${title}" loading="lazy" draggable="false" oncontextmenu="return false;">`;
      }
      if (item.mediaType === "youtube") return youtubeMarkup(item);
      if (item.mediaType === "video") return videoMarkup(item);
      if (item.mediaType === "audio") {
        return `<audio src="${src}" controls preload="metadata"></audio>`;
      }
      return `<div class="folder-document">PDF</div>`;
    };

    const render = () => {
      const visibleItems = activeCategory === "all"
        ? items
        : items.filter((item) => item.category === activeCategory);

      grid.innerHTML = visibleItems.map((item) => {
        const directLink = item.link ? escapeHtml(item.link) : "";
        const actionMarkup = directLink
          ? `<a href="${directLink}" target="_self" rel="noopener">Visit Project →</a>`
          : "";

        const orientation = item.videoOrientation === "vertical" ? "vertical" : "landscape";
        const mediaClasses = item.mediaType === "youtube"
          ? ` is-youtube-card is-${orientation}-card`
          : "";
        const previewClasses = item.mediaType === "youtube"
          ? ` is-youtube-preview is-${orientation}-preview`
          : "";

        return `<article class="folder-media-card reveal visible${mediaClasses}">
          <div class="folder-media-preview${previewClasses}" oncontextmenu="return false;">
            <span class="folder-media-type">${escapeHtml(item.mediaType)}</span>
            ${previewMarkup(item)}
          </div>
          <div class="folder-media-copy">
            <span>${escapeHtml(item.type)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            ${(item.date || item.status) ? `<div class="folder-media-meta">
              ${item.date ? `<span><b>Date</b>${escapeHtml(item.date)}</span>` : ""}
              ${item.status ? `<span><b>Status</b>${escapeHtml(item.status)}</span>` : ""}
            </div>` : ""}
            ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
            ${actionMarkup}
          </div>
        </article>`;
      }).join("");

      empty.hidden = visibleItems.length > 0;
    };

    tabs.innerHTML = categories.map(([slug, label]) =>
      `<button class="folder-tab${slug === "all" ? " active" : ""}" data-folder="${slug}">${label}</button>`
    ).join("");

    tabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-folder]");
      if (!button) return;

      activeCategory = button.dataset.folder;
      tabs.querySelectorAll(".folder-tab").forEach((tab) => {
        tab.classList.toggle("active", tab === button);
      });
      render();
    });

    render();
  };

  onReady(async () => {
    try {
      installMachineStyles();
      const items = await fetchManifestItems();
      renderMotionSystems(items);
      renderRepository(items);
      renderIntelligentMachines(items);
      videoPreviewObserver.observe(document.body, { childList: true, subtree: true });
      enableLazyVideoPreviews(document);
      console.info(`[PB_CONTENT] Loaded ${items.length} manifest items.`);
    } catch (error) {
      console.error("[PB_CONTENT] Media loading failed:", error);

      const repositoryEmpty = document.querySelector("#folder-empty");
      if (repositoryEmpty) {
        repositoryEmpty.hidden = false;
        repositoryEmpty.textContent = `Content could not be loaded: ${error.message}`;
      }

      const motionEmpty = document.querySelector("#motion-project-empty");
      if (motionEmpty) {
        motionEmpty.hidden = false;
        motionEmpty.textContent = `Motion projects could not be loaded: ${error.message}`;
      }
    }
  });
})();

const data = window.PB_CONTENT;
const realmGrid = document.querySelector('#realm-grid');
const experimentList = document.querySelector('#experiment-list');
const machineGrid = document.querySelector('#machine-grid');

const realmTemplate = (realm) => `
  <a class="realm-card realm-card-graphic reveal" href="#${realm.anchor}">
    <img class="realm-card-image" src="${realm.image}" alt="" loading="lazy" />
    <div class="realm-card-shade" aria-hidden="true"></div>
    <div class="realm-card-copy">
      <div class="realm-sigil">${realm.sigil}</div>
      <span class="realm-number">${realm.number}</span>
      <h3>${realm.title}</h3>
      <p>${realm.subtitle}</p>
      <span class="card-arrow">→</span>
    </div>
  </a>`;


if (realmGrid && Array.isArray(data?.realms)) {
  realmGrid.innerHTML = data.realms.map(realmTemplate).join('');
}
if (experimentList && Array.isArray(data?.experiments)) {
  experimentList.innerHTML = data.experiments.map((item) => `
    <article class="experiment-row experiment-row-with-cover reveal visible">
      ${item.image ? `<a class="experiment-cover" href="${item.link || "#"}" aria-label="Open ${item.title || "experiment"}">
        <img src="${item.image}" alt="${item.title || "Experiment"} cover" loading="lazy" draggable="false" />
      </a>` : ""}
      <span class="experiment-code">${item.code || ""}</span>
      <div><h3>${item.title || "Untitled Experiment"}</h3><p>${item.description || ""}</p></div>
      <span class="experiment-status">${item.status || ""}</span>
      ${item.link ? `<a class="experiment-arrow" href="${item.link}" aria-label="Open ${item.title || "experiment"}">→</a>` : `<span aria-hidden="true">→</span>`}
    </article>`).join('');
}
const menuButton = document.querySelector('.menu-button');
const mobilePanel = document.querySelector('.mobile-panel');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobilePanel.classList.toggle('open', !open);
  mobilePanel.setAttribute('aria-hidden', String(open));
});
mobilePanel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  mobilePanel.classList.remove('open');
  mobilePanel.setAttribute('aria-hidden', 'true');
}));



const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  glow.style.transform = `translate(${event.clientX - 260}px, ${event.clientY - 260}px)`;
});

document.querySelector('.signal-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector('input');
  const button = event.currentTarget.querySelector('button');
  if (!input.value.trim()) return input.focus();
  button.innerHTML = 'Signal received <span>✓</span>';
  input.value = '';
});

document.querySelector('#year').textContent = new Date().getFullYear();

// Layered hero animation: smoother parallax, brighter red flicker, embers, and grunge radiowave static.
(() => {
  const hero = document.querySelector('#hero-animation');
  const emberCanvas = hero?.querySelector('.hero-particles');
  const staticCanvas = hero?.querySelector('.hero-static');
  if (!hero || !emberCanvas || !staticCanvas) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const onPointerMove = (event) => {
    const rect = hero.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5);
    targetY = ((event.clientY - rect.top) / rect.height - 0.5);
  };
  hero.addEventListener('pointermove', onPointerMove, { passive: true });
  hero.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
  });

  if (reducedMotion) return;

  const emberCtx = emberCanvas.getContext('2d');
  const staticCtx = staticCanvas.getContext('2d');
  let width = 0;
  let height = 0;
  let ratio = 1;
  let animationFrame = 0;
  let embers = [];
  let ash = [];
  let radioBands = [];
  let noiseCanvas;
  let noiseCtx;
  let noiseWidth = 0;
  let noiseHeight = 0;

  const random = (min, max) => Math.random() * (max - min) + min;

  const spawnEmber = (randomY = false, small = false) => ({
    x: Math.random() * width,
    y: randomY ? Math.random() * height : height + Math.random() * 60,
    radius: small ? random(0.4, 1.1) : random(0.8, 1.8),
    speed: small ? random(0.08, 0.25) : random(0.16, 0.48),
    drift: random(-0.18, 0.18),
    alpha: small ? random(0.05, 0.18) : random(0.14, 0.44),
    phase: Math.random() * Math.PI * 2,
    warm: small ? random(0.3, 0.65) : random(0.68, 1),
  });

  const buildRadioBands = () => Array.from({ length: 5 }, (_, i) => ({
    y: height * (0.18 + i * 0.15) + random(-30, 30),
    amp: random(5, 18),
    freq: random(0.009, 0.022),
    speed: random(0.0007, 0.0016),
    alpha: random(0.015, 0.055),
    phase: random(0, Math.PI * 2),
    thickness: random(0.6, 1.8),
  }));

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));

    [emberCanvas, staticCanvas].forEach((canvas) => {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    });

    emberCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    staticCtx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const emberCount = Math.max(72, Math.min(180, Math.round(width / 9)));
    const ashCount = Math.max(46, Math.min(120, Math.round(width / 13)));
    embers = Array.from({ length: emberCount }, () => spawnEmber(true, false));
    ash = Array.from({ length: ashCount }, () => spawnEmber(true, true));
    radioBands = buildRadioBands();

    noiseWidth = Math.max(180, Math.round(width / 4));
    noiseHeight = Math.max(100, Math.round(height / 4));
    noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = noiseWidth;
    noiseCanvas.height = noiseHeight;
    noiseCtx = noiseCanvas.getContext('2d', { willReadFrequently: true });
    noiseCtx.imageSmoothingEnabled = false;
  };

  const drawEmbers = (time) => {
    emberCtx.clearRect(0, 0, width, height);

    const drawSet = (set, small = false) => {
      set.forEach((particle, index) => {
        particle.y -= particle.speed;
        particle.x += particle.drift + Math.sin(time * 0.0007 + particle.phase) * (small ? 0.05 : 0.12);
        if (particle.y < -16 || particle.x < -22 || particle.x > width + 22) {
          set[index] = spawnEmber(false, small);
          return;
        }

        const flicker = 0.58 + Math.sin(time * 0.0024 + particle.phase) * 0.24 + Math.sin(time * 0.0011 + particle.phase * 0.5) * 0.08;
        const size = particle.radius * (small ? 3.2 : 4.5);
        const gradient = emberCtx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size);
        if (small) {
          gradient.addColorStop(0, `rgba(165,150,132,${particle.alpha * flicker})`);
          gradient.addColorStop(0.4, `rgba(118,106,96,${particle.alpha * 0.45 * flicker})`);
          gradient.addColorStop(1, 'rgba(50,48,45,0)');
        } else {
          const hot = 188 + Math.round(45 * particle.warm);
          const warm = 92 + Math.round(35 * particle.warm);
          gradient.addColorStop(0, `rgba(${hot},${warm},44,${particle.alpha * flicker})`);
          gradient.addColorStop(0.28, `rgba(152,58,24,${particle.alpha * 0.62 * flicker})`);
          gradient.addColorStop(1, 'rgba(68,18,8,0)');
        }
        emberCtx.fillStyle = gradient;
        emberCtx.beginPath();
        emberCtx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        emberCtx.fill();
      });
    };

    drawSet(embers, false);
    drawSet(ash, true);
  };

  const drawStatic = (time) => {
    staticCtx.clearRect(0, 0, width, height);
    if (!noiseCtx) return;

    const imageData = noiseCtx.createImageData(noiseWidth, noiseHeight);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const value = Math.floor(22 + Math.random() * 170);
      const alpha = Math.random() < 0.72 ? Math.random() * 36 : Math.random() * 12;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value + (Math.random() * 12);
      data[i + 3] = alpha;
    }
    noiseCtx.putImageData(imageData, 0, 0);

    staticCtx.save();
    staticCtx.globalAlpha = 0.75;
    staticCtx.imageSmoothingEnabled = false;
    staticCtx.drawImage(noiseCanvas, 0, 0, width, height);
    staticCtx.restore();

    radioBands.forEach((band, index) => {
      const y = band.y + Math.sin(time * band.speed + band.phase) * (band.amp * 1.2);
      staticCtx.beginPath();
      staticCtx.lineWidth = band.thickness;
      staticCtx.strokeStyle = `rgba(255,255,255,${band.alpha})`;
      for (let x = 0; x <= width; x += 10) {
        const waveY = y + Math.sin(x * band.freq + time * band.speed * 24 + band.phase) * band.amp;
        if (x === 0) staticCtx.moveTo(x, waveY);
        else staticCtx.lineTo(x, waveY);
      }
      staticCtx.stroke();

      staticCtx.fillStyle = index % 2 === 0 ? 'rgba(255,58,38,0.028)' : 'rgba(255,255,255,0.02)';
      staticCtx.fillRect(0, y - band.thickness * 2.2, width, band.thickness * 4.4);
    });

    if (Math.random() < 0.08) {
      const glitchY = Math.random() * height;
      const glitchH = random(8, 28);
      staticCtx.fillStyle = `rgba(255,255,255,${random(0.02, 0.06)})`;
      staticCtx.fillRect(0, glitchY, width, glitchH);
      staticCtx.fillStyle = `rgba(255,48,34,${random(0.015, 0.045)})`;
      staticCtx.fillRect(0, glitchY + 1, width, glitchH * 0.55);
    }
  };

  const draw = (time) => {
    currentX += (targetX - currentX) * 0.065;
    currentY += (targetY - currentY) * 0.065;
    hero.style.setProperty('--hero-x', currentX.toFixed(4));
    hero.style.setProperty('--hero-y', currentY.toFixed(4));

    const pulse = 0.92 + Math.sin(time * 0.0037) * 0.14;
    const flicker = (Math.random() * 0.18) + (Math.random() < 0.08 ? random(0.14, 0.32) : 0);
    hero.style.setProperty('--glow-flicker', Math.min(1.45, pulse + flicker).toFixed(3));
    hero.style.setProperty('--glow-scale', (1.0 + Math.sin(time * 0.0022) * 0.02 + Math.random() * 0.012).toFixed(3));
    hero.style.setProperty('--static-opacity', (0.09 + Math.random() * 0.08).toFixed(3));

    drawEmbers(time);
    drawStatic(time);
    animationFrame = requestAnimationFrame(draw);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(hero);
  resize();
  animationFrame = requestAnimationFrame(draw);

  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(animationFrame);
    observer.disconnect();
  }, { once: true });
})();
