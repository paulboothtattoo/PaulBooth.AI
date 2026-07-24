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

const items = [];

for (const [slug, label] of Object.entries(categories)) {
  const directory = path.join(root, slug);
  if (!fs.existsSync(directory)) continue;

  for (const filename of fs.readdirSync(directory)) {
    if (filename.startsWith(".") || filename === "README.txt") continue;

    const fullPath = path.join(directory, filename);
    if (!fs.statSync(fullPath).isFile()) continue;

    const extension = path.extname(filename).slice(1).toLowerCase();
    if (!extensions[extension]) continue;

    const base = path.basename(filename, path.extname(filename));
    const metadataPath = path.join(directory, `${base}.json`);
    let metadata = {};

    if (fs.existsSync(metadataPath)) {
      try {
        metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
      } catch (error) {
        console.warn(`Invalid JSON ignored: ${metadataPath}`);
      }
    }

    items.push({
      id: `${slug}-${base.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
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

const output = {
  generatedAt: new Date().toISOString(),
  items,
};

fs.writeFileSync(
  path.join(__dirname, "content-manifest.json"),
  JSON.stringify(output, null, 2)
);

console.log(`Generated content-manifest.json with ${items.length} item(s).`);
