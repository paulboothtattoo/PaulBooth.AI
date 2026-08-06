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

  const FALLBACK_GALLERIES = [
  {
    "id": "synthetic-visions-01",
    "title": "Synthetic Visions-01",
    "description": "",
    "hidden": false,
    "images": [
      {
        "src": "content/visual-work/Biomech Dead 17.png",
        "title": "",
        "caption": "",
        "alt": "Biomech Dead 17",
        "hidden": false
      },
      {
        "src": "content/visual-work/Booth Spiral 15.png",
        "title": "",
        "caption": "",
        "alt": "Booth Spiral 15",
        "hidden": false
      },
      {
        "src": "content/visual-work/CyberLeaf 04.png",
        "title": "",
        "caption": "",
        "alt": "CyberLeaf 04",
        "hidden": false
      },
      {
        "src": "content/visual-work/Deemz 21.png",
        "title": "",
        "caption": "",
        "alt": "Deemz 21",
        "hidden": false
      },
      {
        "src": "content/visual-work/Eyeball 01.png",
        "title": "",
        "caption": "",
        "alt": "Eyeball 01",
        "hidden": false
      },
      {
        "src": "content/visual-work/EyeSpiral 01.jpg",
        "title": "",
        "caption": "",
        "alt": "EyeSpiral 01",
        "hidden": false
      },
      {
        "src": "content/visual-work/Grotesque 04.png",
        "title": "",
        "caption": "",
        "alt": "Grotesque 04",
        "hidden": false
      },
      {
        "src": "content/visual-work/Kraken Chick 01.png",
        "title": "",
        "caption": "",
        "alt": "Kraken Chick 01",
        "hidden": false
      },
      {
        "src": "content/visual-work/Leaf 23.png",
        "title": "",
        "caption": "",
        "alt": "Leaf 23",
        "hidden": false
      },
      {
        "src": "content/visual-work/Medusa 07.jpeg",
        "title": "",
        "caption": "",
        "alt": "Medusa 07",
        "hidden": false
      },
      {
        "src": "content/visual-work/Old Gasp 03.png",
        "title": "",
        "caption": "",
        "alt": "Old Gasp 03",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_angry_biomechanical_woman_showing_teeth_82ba39ca-1086-441e-aec1-380f8428f93b.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo angry biomechanical woman showing teeth 82ba39ca 1086 441e aec1 380f8428f93b",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_close_up_raw_biomechanical_human_skin_in_style_fdea3d63-2ab2-4f11-aabc-de44e967447f.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo close up raw biomechanical human skin in style fdea3d63 2ab2 4f11 aabc de44e967447f",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_cref--_315bb441-1397-498a-856e-9953a194f394.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo cref   315bb441 1397 498a 856e 9953a194f394",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_cref--_84d6f643-a891-4aaa-add6-6a01951e1e0f.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo cref   84d6f643 a891 4aaa add6 6a01951e1e0f",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_distorted_agonized_faces_in_smoke_floating_82cf5a75-f926-49bd-b652-f34969ecc2cb.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo distorted agonized faces in smoke floating 82cf5a75 f926 49bd b652 f34969ecc2cb",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_female_siren_seraphim_wings_autumn_leaves_grow_d01e559a-5ef7-4768-986a-03ab91f71845.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo female siren seraphim wings autumn leaves grow d01e559a 5ef7 4768 986a 03ab91f71845",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_nun_three_quarter_vew_372b6d5d-dbfa-4582-a91a-8e2f0e2abdd7.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo nun three quarter vew 372b6d5d dbfa 4582 a91a 8e2f0e2abdd7",
        "hidden": false
      },
      {
        "src": "content/visual-work/Ponder 01.png",
        "title": "",
        "caption": "",
        "alt": "Ponder 01",
        "hidden": false
      },
      {
        "src": "content/visual-work/Shrooms 23.png",
        "title": "",
        "caption": "",
        "alt": "Shrooms 23",
        "hidden": false
      },
      {
        "src": "content/visual-work/Siamese 55.png",
        "title": "",
        "caption": "",
        "alt": "Siamese 55",
        "hidden": false
      },
      {
        "src": "content/visual-work/Surrealish 02.png",
        "title": "",
        "caption": "",
        "alt": "Surrealish 02",
        "hidden": false
      },
      {
        "src": "content/visual-work/Tentacles 09.png",
        "title": "",
        "caption": "",
        "alt": "Tentacles 09",
        "hidden": false
      }
    ]
  },
  {
    "id": "synthetic-visions-02",
    "title": "Synthetic Visions-02",
    "description": "",
    "hidden": false,
    "images": [
      {
        "src": "content/visual-work/Booth Spiral 04.png",
        "title": "",
        "caption": "",
        "alt": "Booth Spiral 04",
        "hidden": false
      },
      {
        "src": "content/visual-work/Booth Spiral 16.png",
        "title": "",
        "caption": "",
        "alt": "Booth Spiral 16",
        "hidden": false
      },
      {
        "src": "content/visual-work/DarkPixie 01.png",
        "title": "",
        "caption": "",
        "alt": "DarkPixie 01",
        "hidden": false
      },
      {
        "src": "content/visual-work/Demon 04.webp",
        "title": "",
        "caption": "",
        "alt": "Demon 04",
        "hidden": false
      },
      {
        "src": "content/visual-work/Eyeball 19.png",
        "title": "",
        "caption": "",
        "alt": "Eyeball 19",
        "hidden": false
      },
      {
        "src": "content/visual-work/Girl 01.jpg",
        "title": "",
        "caption": "",
        "alt": "Girl 01",
        "hidden": false
      },
      {
        "src": "content/visual-work/Grotesque 08.png",
        "title": "",
        "caption": "",
        "alt": "Grotesque 08",
        "hidden": false
      },
      {
        "src": "content/visual-work/Kraken Skull 08.png",
        "title": "",
        "caption": "",
        "alt": "Kraken Skull 08",
        "hidden": false
      },
      {
        "src": "content/visual-work/Leaf Dead 07.png",
        "title": "",
        "caption": "",
        "alt": "Leaf Dead 07",
        "hidden": false
      },
      {
        "src": "content/visual-work/Old Cyborg 02.png",
        "title": "",
        "caption": "",
        "alt": "Old Cyborg 02",
        "hidden": false
      },
      {
        "src": "content/visual-work/Old Gasp 05.png",
        "title": "",
        "caption": "",
        "alt": "Old Gasp 05",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_chinese_FUJIN_blowing_wind_IN_THE_STYLE_OF_PAU_61964616-7426-4c0f-8ea5-4f80c0565bf4.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo chinese FUJIN blowing wind IN THE STYLE OF PAU 61964616 7426 4c0f 8ea5 4f80c0565bf4",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_cref--_0a6a86a8-74f8-4a34-bfb6-45fccbab66b7.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo cref   0a6a86a8 74f8 4a34 bfb6 45fccbab66b7",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_cref--_3d288bc2-3260-405e-b026-dfca50d9fa13.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo cref   3d288bc2 3260 405e b026 dfca50d9fa13",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_cref--_8deeb9b5-8142-4e9d-bdf5-54e3cd4ab740.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo cref   8deeb9b5 8142 4e9d bdf5 54e3cd4ab740",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_female_siren_seraphim_wings_autumn_leaves_grow_2d06bc05-ab45-4967-8bd1-11bf70e41284.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo female siren seraphim wings autumn leaves grow 2d06bc05 ab45 4967 8bd1 11bf70e41284",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_human_skin_with_no_hand_7b944560-2737-4d22-a839-07155ae47e23.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo human skin with no hand 7b944560 2737 4d22 a839 07155ae47e23",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_siren_seraphim_wings_autumn_leaves_growing_out_e3d3e99b-0b43-425f-80fc-f4769f572abb.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo siren seraphim wings autumn leaves growing out e3d3e99b 0b43 425f 80fc f4769f572abb",
        "hidden": false
      },
      {
        "src": "content/visual-work/Roots 14.png",
        "title": "",
        "caption": "",
        "alt": "Roots 14",
        "hidden": false
      },
      {
        "src": "content/visual-work/Siamese 10.png",
        "title": "",
        "caption": "",
        "alt": "Siamese 10",
        "hidden": false
      },
      {
        "src": "content/visual-work/SkullMoth 04.png",
        "title": "",
        "caption": "",
        "alt": "SkullMoth 04",
        "hidden": false
      },
      {
        "src": "content/visual-work/Surrealish 06.png",
        "title": "",
        "caption": "",
        "alt": "Surrealish 06",
        "hidden": false
      }
    ]
  },
  {
    "id": "synthetic-visions-03",
    "title": "Synthetic Visions-03",
    "description": "",
    "hidden": false,
    "images": [
      {
        "src": "content/visual-work/Booth Spiral 08.png",
        "title": "",
        "caption": "",
        "alt": "Booth Spiral 08",
        "hidden": false
      },
      {
        "src": "content/visual-work/Booth Spiral 22.png",
        "title": "",
        "caption": "",
        "alt": "Booth Spiral 22",
        "hidden": false
      },
      {
        "src": "content/visual-work/Deemz 08.png",
        "title": "",
        "caption": "",
        "alt": "Deemz 08",
        "hidden": false
      },
      {
        "src": "content/visual-work/Devil Lettuce 05.webp",
        "title": "",
        "caption": "",
        "alt": "Devil Lettuce 05",
        "hidden": false
      },
      {
        "src": "content/visual-work/Eyeball Tentacles 26.png",
        "title": "",
        "caption": "",
        "alt": "Eyeball Tentacles 26",
        "hidden": false
      },
      {
        "src": "content/visual-work/Grotesque 02.png",
        "title": "",
        "caption": "",
        "alt": "Grotesque 02",
        "hidden": false
      },
      {
        "src": "content/visual-work/Insectoid 02.png",
        "title": "",
        "caption": "",
        "alt": "Insectoid 02",
        "hidden": false
      },
      {
        "src": "content/visual-work/Leaf 20.png",
        "title": "",
        "caption": "",
        "alt": "Leaf 20",
        "hidden": false
      },
      {
        "src": "content/visual-work/Leaf Dead 11.png",
        "title": "",
        "caption": "",
        "alt": "Leaf Dead 11",
        "hidden": false
      },
      {
        "src": "content/visual-work/Old Cyborg 17.png",
        "title": "",
        "caption": "",
        "alt": "Old Cyborg 17",
        "hidden": false
      },
      {
        "src": "content/visual-work/OldLady 01.webp",
        "title": "",
        "caption": "",
        "alt": "OldLady 01",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_chinese_FUJIN_blowing_wind_IN_THE_STYLE_OF_PAU_c5e2cc1e-6195-48ae-8589-27d06d44612e.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo chinese FUJIN blowing wind IN THE STYLE OF PAU c5e2cc1e 6195 48ae 8589 27d06d44612e",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_cref--_2d12b4f6-06ea-4f89-85cd-67c0c2301a1d.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo cref   2d12b4f6 06ea 4f89 85cd 67c0c2301a1d",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_cref--_5a5dd537-254c-4538-8948-6280124b8767.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo cref   5a5dd537 254c 4538 8948 6280124b8767",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_death_headmoth_flying_ec4c3c36-af2b-4bec-98c3-8ab028915d4c (1) copy.jpg",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo death headmoth flying ec4c3c36 af2b 4bec 98c3 8ab028915d4c (1) copy",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_female_siren_seraphim_wings_autumn_leaves_grow_a20226c4-cd96-41e6-b4d2-e67dcdf65369.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo female siren seraphim wings autumn leaves grow a20226c4 cd96 41e6 b4d2 e67dcdf65369",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_hyper_realistic_3-D_creepy_doll_in_a_little_de_3f966964-ad00-4cbf-9fca-89f4d5397039.png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo hyper realistic 3 D creepy doll in a little de 3f966964 ad00 4cbf 9fca 89f4d5397039",
        "hidden": false
      },
      {
        "src": "content/visual-work/paulbooth.tattoo_stretched_human_skin_sheet_of_canvas_59da7041-63c7-4b96-a6aa-d69c2fd87ea0 (1).png",
        "title": "",
        "caption": "",
        "alt": "paulbooth.tattoo stretched human skin sheet of canvas 59da7041 63c7 4b96 a6aa d69c2fd87ea0 (1)",
        "hidden": false
      },
      {
        "src": "content/visual-work/Shrooms 10.png",
        "title": "",
        "caption": "",
        "alt": "Shrooms 10",
        "hidden": false
      },
      {
        "src": "content/visual-work/Siamese 35.png",
        "title": "",
        "caption": "",
        "alt": "Siamese 35",
        "hidden": false
      },
      {
        "src": "content/visual-work/SkullMoth 20.png",
        "title": "",
        "caption": "",
        "alt": "SkullMoth 20",
        "hidden": false
      },
      {
        "src": "content/visual-work/Surrealish 16b copy.png",
        "title": "",
        "caption": "",
        "alt": "Surrealish 16b copy",
        "hidden": false
      }
    ]
  }
];

  const IMAGE_EXTENSIONS = /\.(?:avif|gif|jpe?g|png|webp)$/i;
  const VISUAL_WORK_PATH = "content/visual-work/";
  const GITHUB_CONTENTS_API = "https://api.github.com/repos/paulboothtattoo/PaulBooth-ai-site/contents/content/visual-work?ref=main";

  const filenameFromPath = (path = "") => decodeURIComponent(String(path).split("/").pop() || "");
  const cleanAlt = (filename = "") => filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Gallery artwork";

  const splitIntoThree = (paths) => {
    const unique = [...new Set(paths.filter((path) => IMAGE_EXTENSIONS.test(path)))].sort((a, b) =>
      filenameFromPath(a).localeCompare(filenameFromPath(b), undefined, { numeric: true, sensitivity: "base" })
    );

    const groups = [[], [], []];
    unique.forEach((src, index) => {
      groups[index % 3].push({
        src,
        title: "",
        caption: "",
        alt: cleanAlt(filenameFromPath(src)),
        hidden: false
      });
    });

    return groups.map((images, index) => ({
      id: `synthetic-visions-${String(index + 1).padStart(2, "0")}`,
      title: `Synthetic Visions-${String(index + 1).padStart(2, "0")}`,
      description: "",
      hidden: false,
      images
    }));
  };

  const loadManifest = async () => {
    const url = new URL("content/visual-work/visual-work-manifest.json", document.baseURI);
    url.searchParams.set("cache", Date.now().toString());
    const response = await fetch(url.href, { cache: "no-store", headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`visual-work-manifest.json returned HTTP ${response.status}`);
    const payload = await response.json();
    const files = Array.isArray(payload) ? payload : payload.files;
    if (!Array.isArray(files)) throw new Error("visual-work-manifest.json has no files array");
    return files.map((file) => typeof file === "string" ? `${VISUAL_WORK_PATH}${file}` : file.src).filter(Boolean);
  };

  const loadDirectoryListing = async () => {
    const url = new URL(VISUAL_WORK_PATH, document.baseURI);
    const response = await fetch(url.href, { cache: "no-store" });
    if (!response.ok) throw new Error(`visual-work directory returned HTTP ${response.status}`);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const files = Array.from(doc.querySelectorAll("a[href]"))
      .map((link) => link.getAttribute("href"))
      .filter((href) => href && !href.startsWith("?") && IMAGE_EXTENSIONS.test(href))
      .map((href) => new URL(href, url).href)
      .map((href) => {
        const parsed = new URL(href);
        const marker = `/${VISUAL_WORK_PATH}`;
        const pos = parsed.pathname.indexOf(marker);
        return pos >= 0 ? parsed.pathname.slice(pos + 1) : `${VISUAL_WORK_PATH}${filenameFromPath(parsed.pathname)}`;
      });
    if (!files.length) throw new Error("No images found in directory listing");
    return files;
  };

  const loadGitHubFolder = async () => {
    const response = await fetch(GITHUB_CONTENTS_API, {
      cache: "no-store",
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(`GitHub contents API returned HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload)) throw new Error("GitHub contents response is not an array");
    const files = payload
      .filter((entry) => entry && entry.type === "file" && IMAGE_EXTENSIONS.test(entry.name || ""))
      .map((entry) => `${VISUAL_WORK_PATH}${entry.name}`);
    if (!files.length) throw new Error("No images found through GitHub contents API");
    return files;
  };

  const loadConfiguredGalleries = async () => {
    const url = new URL("visions-galleries.json", document.baseURI);
    url.searchParams.set("cache", Date.now().toString());
    const response = await fetch(url.href, { cache: "no-store", headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`visions-galleries.json returned HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload || !Array.isArray(payload.galleries)) throw new Error("visions-galleries.json has no galleries array");
    return payload.galleries;
  };

  const loadGalleries = async () => {
    const loaders = [loadManifest, loadDirectoryListing, loadGitHubFolder];
    for (const loader of loaders) {
      try {
        const files = await loader();
        if (files.length) return splitIntoThree(files);
      } catch (error) {
        console.info("[PB_VISIONS] Image discovery method skipped:", error.message);
      }
    }

    try {
      const configured = await loadConfiguredGalleries();
      const files = configured.flatMap((gallery) => Array.isArray(gallery.images) ? gallery.images.map((image) => image && image.src).filter(Boolean) : []);
      if (files.length) return splitIntoThree(files);
    } catch (error) {
      console.warn("[PB_VISIONS] External gallery configuration unavailable.", error);
    }

    return splitIntoThree(FALLBACK_GALLERIES.flatMap((gallery) => gallery.images.map((image) => image.src)));
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
      console.warn("[PB_VISIONS] External gallery configuration could not be loaded; using embedded restored gallery data.", error);
      render(FALLBACK_GALLERIES);
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
    lightboxCaption.textContent = "";

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

  const blockImageAction = (event) => {
    if (event.target.closest("#visions-gallery-root, #visions-lightbox")) event.preventDefault();
  };

  document.addEventListener("contextmenu", blockImageAction, true);
  document.addEventListener("dragstart", blockImageAction, true);
  document.addEventListener("copy", blockImageAction, true);

  document.addEventListener("keydown", (event) => {
    const key = String(event.key || "").toLowerCase();
    const saveShortcut = (event.ctrlKey || event.metaKey) && (key === "s" || key === "u" || key === "p");
    if (saveShortcut && !lightbox.hidden) event.preventDefault();
  }, true);

})();
