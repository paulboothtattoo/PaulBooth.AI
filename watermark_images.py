from pathlib import Path
from PIL import Image, ImageEnhance
import shutil

# =========================
# PAUL BOOTH IMAGE WATERMARKER
# =========================
# Default setup:
# - place this script in your site root
# - place watermark-logo.png in the same folder as this script
# - run: py watermark_images.py
#
# What it does:
# - scans selected site folders for PNG/JPG/JPEG/WEBP images
# - burns a subtle watermark into each image
# - creates a one-time backup of the original image
# - overwrites the original so the site uses the watermarked version
#
# Safe behavior:
# - if a backup already exists for a file, the script assumes that image was
#   already processed and skips it, so rerunning the script will not double-mark it

SITE_ROOT = Path(__file__).resolve().parent
WATERMARK_FILE = SITE_ROOT / "watermark-logo.png"

# Folders to watermark.
# You can add or remove folders here.
TARGET_DIRS = [
    SITE_ROOT / "content",
    SITE_ROOT / "projects" / "babylon-black" / "media" / "gallery",
]

# Folders to ignore completely.
EXCLUDE_DIR_NAMES = {
    ".git",
    "__pycache__",
    "node_modules",
    "_watermark_backup",
}

# File types to process.
VALID_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

# Where original unwatermarked files are backed up.
BACKUP_ROOT = SITE_ROOT / "_watermark_backup"

# Watermark appearance
OPACITY = 0.16          # 0.10 to 0.25 is usually good
WIDTH_RATIO = 0.085     # watermark width = 8.5% of image width
MIN_WM_WIDTH = 90
MAX_WM_WIDTH = 220
PADDING_RATIO = 0.02    # 2% edge padding

# Save quality
JPEG_QUALITY = 95
WEBP_QUALITY = 95


def iter_image_files(folder: Path):
    for path in folder.rglob("*"):
        if not path.is_file():
            continue
        if any(part in EXCLUDE_DIR_NAMES for part in path.parts):
            continue
        if path.suffix.lower() not in VALID_EXTS:
            continue
        if path.name.lower() == WATERMARK_FILE.name.lower():
            continue
        yield path


def load_watermark():
    if not WATERMARK_FILE.exists():
        raise FileNotFoundError(
            f"Watermark logo not found: {WATERMARK_FILE}\n"
            f"Place watermark-logo.png in: {SITE_ROOT}"
        )
    return Image.open(WATERMARK_FILE).convert("RGBA")


def resize_watermark(watermark: Image.Image, base_width: int) -> Image.Image:
    target_w = int(base_width * WIDTH_RATIO)
    target_w = max(MIN_WM_WIDTH, min(MAX_WM_WIDTH, target_w))
    ratio = target_w / watermark.width
    target_h = max(1, int(watermark.height * ratio))
    return watermark.resize((target_w, target_h), Image.LANCZOS)


def apply_opacity(watermark: Image.Image, opacity: float) -> Image.Image:
    wm = watermark.copy()
    alpha = wm.getchannel("A")
    alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
    wm.putalpha(alpha)
    return wm


def watermark_image(image_path: Path, watermark_source: Image.Image):
    rel_path = image_path.relative_to(SITE_ROOT)
    backup_path = BACKUP_ROOT / rel_path

    # If backup already exists, assume already processed and skip.
    if backup_path.exists():
        return "skipped", image_path

    backup_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(image_path, backup_path)

    original = Image.open(image_path).convert("RGBA")
    canvas = Image.new("RGBA", original.size, (0, 0, 0, 0))
    canvas.alpha_composite(original)

    wm = resize_watermark(watermark_source, original.width)
    wm = apply_opacity(wm, OPACITY)

    pad = max(10, int(min(original.size) * PADDING_RATIO))
    x = max(0, original.width - wm.width - pad)
    y = max(0, original.height - wm.height - pad)

    canvas.alpha_composite(wm, (x, y))

    ext = image_path.suffix.lower()
    if ext in {".jpg", ".jpeg"}:
        out = Image.new("RGB", canvas.size, (0, 0, 0))
        out.paste(canvas, mask=canvas.getchannel("A"))
        out.save(image_path, quality=JPEG_QUALITY, optimize=True)
    elif ext == ".webp":
        out = canvas.convert("RGBA")
        out.save(image_path, quality=WEBP_QUALITY, method=6)
    else:
        canvas.save(image_path)

    return "processed", image_path


def main():
    print("=" * 70)
    print("PAUL BOOTH IMAGE WATERMARKER")
    print("=" * 70)
    print(f"Site root      : {SITE_ROOT}")
    print(f"Watermark file : {WATERMARK_FILE}")
    print(f"Backup folder  : {BACKUP_ROOT}")
    print("Target folders :")
    for folder in TARGET_DIRS:
        print(f"  - {folder}")
    print("")

    watermark = load_watermark()

    processed = 0
    skipped = 0
    missing = 0

    for folder in TARGET_DIRS:
        if not folder.exists():
            print(f"[missing folder] {folder}")
            missing += 1
            continue

        for image_path in iter_image_files(folder):
            status, path = watermark_image(image_path, watermark)
            if status == "processed":
                processed += 1
                print(f"[watermarked] {path}")
            else:
                skipped += 1
                print(f"[skipped]     {path}")

    print("")
    print("=" * 70)
    print("DONE")
    print("=" * 70)
    print(f"Processed : {processed}")
    print(f"Skipped   : {skipped}")
    print(f"Missing folders : {missing}")
    print("")
    print("Original files are backed up in:")
    print(BACKUP_ROOT)
    print("")
    print("If you want to watermark additional folders, edit TARGET_DIRS in:")
    print(Path(__file__).name)


if __name__ == "__main__":
    main()
