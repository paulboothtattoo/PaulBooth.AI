const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "content");
const categories = {
  "ai-platforms": "AI Platforms",
  "visual-work": "Visual Work",
  "motion": "Motion",
  "research": "Research",
  "experiments": "Active Experiments",
  "machines": "Intelligent Machines",
};

const extensions = {
  jpg: "image", jpeg: "image", png: "image", webp: "image", gif: "image", avif: "image",
  mp4: "video", webm: "video", mov: "video",
  mp3: "audio", wav: "audio", ogg: "audio", m4a: "audio",
  pdf: "document",
};

const humanize = (name) =>
  name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

const slugify = (value) =>
  String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const items = [];

for (const [slug, label] of Object.entries(categories)) {
  const directory = path.join(root, slug);
  if (!fs.existsSync(directory)) continue;

  const filenames = fs.readdirSync(directory);
  const youtubeBases = new Set();

  // First create YouTube records directly from JSON metadata.
  for (const filename of filenames) {
    if (!filename.toLowerCase().endsWith(".json") || filename === "example-project.json") continue;

    const fullPath = path.join(directory, filename);
    let metadata = {};
    try {
      metadata = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    } catch {
      console.warn(`Invalid JSON ignored: ${fullPath}`);
      continue;
    }

    if (!metadata.youtubeId && metadata.mediaType !== "youtube") continue;

    const base = path.basename(filename, ".json");
    youtubeBases.add(base.toLowerCase());

    items.push({
      id: metadata.id || `${slug}-${slugify(base)}`,
      category: slug,
      categoryLabel: metadata.categoryLabel || label,
      title: metadata.title || humanize(base),
      description: metadata.description || "",
      type: metadata.type || label,
      status: metadata.status || "",
      date: metadata.date || "",
      link: metadata.link || "",
      mediaType: "youtube",
      src: "",
      filename: "",
      youtubeId: metadata.youtubeId || "",
      videoOrientation: metadata.videoOrientation === "vertical" ? "vertical" : "landscape",
      embedUrl: metadata.embedUrl || `https://www.youtube-nocookie.com/embed/${metadata.youtubeId || ""}`,
      poster: metadata.poster || "",
      posterFallback: metadata.posterFallback || "",
      modified: fs.statSync(fullPath).mtimeMs,
    });
  }

  // Then add ordinary files, skipping deleted/replaced MP4 counterparts.
  for (const filename of filenames) {
    if (filename.startsWith(".") || filename === "README.txt") continue;

    const fullPath = path.join(directory, filename);
    if (!fs.statSync(fullPath).isFile()) continue;

    const extension = path.extname(filename).slice(1).toLowerCase();
    if (!extensions[extension]) continue;

    const base = path.basename(filename, path.extname(filename));
    if (youtubeBases.has(base.toLowerCase()) && extensions[extension] === "video") continue;

    const metadataPath = path.join(directory, `${base}.json`);
    let metadata = {};

    if (fs.existsSync(metadataPath)) {
      try {
        metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
      } catch {
        console.warn(`Invalid JSON ignored: ${metadataPath}`);
      }
    }

    items.push({
      id: `${slug}-${slugify(base)}`,
      category: slug,
      categoryLabel: label,
      title: metadata.title || humanize(base),
      description: metadata.description || "",
      type: metadata.type || label,
      status: metadata.status || "",
      date: metadata.date || "",
      link: metadata.link || "",
      mediaType: extensions[extension],
      src: `content/${encodeURIComponent(slug)}/${encodeURIComponent(filename)}`,
      filename,
      modified: fs.statSync(fullPath).mtimeMs,
    });
  }
}

items.sort((a, b) => b.modified - a.modified);

fs.writeFileSync(
  path.join(__dirname, "content-manifest.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2)
);

console.log(`Generated content-manifest.json with ${items.length} item(s).`);
