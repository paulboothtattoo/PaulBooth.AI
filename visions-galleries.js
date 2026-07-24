(() => {
  "use strict";

  const root = document.querySelector("#visions-gallery-root");
  const empty = document.querySelector("#visions-gallery-empty");
  if (!root || !empty) return;

  const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);

  const loadGalleries = async () => {
    const url = new URL("visions-galleries.json", document.baseURI);
    url.searchParams.set("cache", Date.now().toString());

    const response = await fetch(url.href, {
      cache: "no-store",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`visions-galleries.json returned HTTP ${response.status}`);
    }

    const payload = await response.json();
    if (!payload || !Array.isArray(payload.galleries)) {
      throw new Error("visions-galleries.json does not contain a galleries array");
    }

    return payload.galleries;
  };

  const render = (galleries) => {
    const visible = galleries.filter(
      (gallery) => gallery && gallery.hidden !== true && Array.isArray(gallery.images)
    );

    root.innerHTML = visible.map((gallery, galleryIndex) => `
      <article class="visions-gallery reveal visible">
        <header class="visions-gallery-header">
          <span class="eyebrow">Gallery ${String(galleryIndex + 1).padStart(2, "0")}</span>
          <h3>${escapeHtml(gallery.title || "Untitled Gallery")}</h3>
          ${gallery.description ? `<p>${escapeHtml(gallery.description)}</p>` : ""}
        </header>

        <div class="visions-gallery-grid">
          ${gallery.images
            .filter((image) => image && image.hidden !== true && image.src)
            .map((image) => `
              <figure class="visions-photo-card protected-image" tabindex="0" role="button" aria-label="Enlarge image" data-lightbox-item>
                <img
                  src="${escapeHtml(image.src)}"
                  alt="${escapeHtml(image.alt || image.title || gallery.title || "")}"
                  loading="lazy"
                  draggable="false"
                />
              </figure>
            `).join("")}
        </div>
      </article>
    `).join("");

    empty.hidden = visible.length > 0;
  };

  loadGalleries()
    .then(render)
    .catch((error) => {
      console.error("[PB_VISIONS] Gallery loading failed:", error);
      empty.hidden = false;
      empty.textContent = `Visions galleries could not be loaded: ${error.message}`;
    });

  const lightbox = document.createElement("div");
  lightbox.id = "visions-lightbox";
  lightbox.className = "visions-lightbox";
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button type="button" class="visions-lightbox-close" aria-label="Close">×</button>
    <button type="button" class="visions-lightbox-nav visions-lightbox-prev" aria-label="Previous">‹</button>
    <div class="visions-lightbox-stage">
      <img class="visions-lightbox-image" alt="" draggable="false" />
      <div class="visions-lightbox-caption"></div>
    </div>
    <button type="button" class="visions-lightbox-nav visions-lightbox-next" aria-label="Next">›</button>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".visions-lightbox-image");
  const lightboxCaption = lightbox.querySelector(".visions-lightbox-caption");
  const closeButton = lightbox.querySelector(".visions-lightbox-close");
  const prevButton = lightbox.querySelector(".visions-lightbox-prev");
  const nextButton = lightbox.querySelector(".visions-lightbox-next");
  let currentIndex = -1;

  const getItems = () => Array.from(root.querySelectorAll("[data-lightbox-item]"));

  const showItem = (index) => {
    const items = getItems();
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const image = item.querySelector("img");
    if (!image) return;


    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Expanded gallery image";
    lightboxCaption.innerHTML = "";

    lightbox.hidden = false;
    document.body.classList.add("visions-lightbox-open");
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("visions-lightbox-open");
    currentIndex = -1;
  };

  root.addEventListener("click", (event) => {
    const item = event.target.closest("[data-lightbox-item]");
    if (!item) return;
    showItem(getItems().indexOf(item));
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const item = event.target.closest("[data-lightbox-item]");
    if (!item) return;
    event.preventDefault();
    showItem(getItems().indexOf(item));
  });

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => showItem(currentIndex - 1));
  nextButton.addEventListener("click", () => showItem(currentIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showItem(currentIndex - 1);
    if (event.key === "ArrowRight") showItem(currentIndex + 1);
  });

})();
