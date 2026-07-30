from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter
import shutil
import sys

# ============================================================
# PAULBOOTH.AI IMAGE WATERMARKER — V2
# ============================================================
#
# Improvements over V1:
# - uses a compact, high-contrast monogram
# - watermark is larger and more visible
# - reprocesses from clean backups instead of skipping files
# - covers content/ and projects/ recursively
# - keeps original files safely backed up
#
# Run from the PaulBooth.ai site root:
#   py .\watermark_images_v2.py
#
# Dependencies:
#   py -m pip install pillow

SITE_ROOT = Path(__file__).resolve().parent
WATERMARK_FILE = SITE_ROOT / "watermark-monogram.png"
BACKUP_ROOT = SITE_ROOT / "_watermark_backup"

TARGET_DIRS = [
    SITE_ROOT / "content",
    SITE_ROOT / "projects",
]

VALID_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

EXCLUDE_DIR_NAMES = {
    ".git",
    "__pycache__",
    "node_modules",
    "_watermark_backup",
}

EXCLUDE_FILE_NAMES = {
    "watermark-monogram.png",
    "watermark-logo.png",
    "paulbooth-ai-logo-transparent.png",
    "page-background-tile.png",
}

# Appearance
OPACITY = 0.62
WIDTH_RATIO = 0.16
MIN_WM_WIDTH = 120
MAX_WM_WIDTH = 300
PADDING_RATIO = 0.022

# Save settings
JPEG_QUALITY = 95
WEBP_QUALITY = 95

# Always rebuild from the clean backup if one exists.
REPROCESS_FROM_BACKUP = True


def iter_images(folder: Path):
    for path in folder.rglob("*"):
        if not path.is_file():
            continue

        if any(part in EXCLUDE_DIR_NAMES for part in path.parts):
            continue

        if path.suffix.lower() not in VALID_EXTS:
            continue

        if path.name.lower() in {name.lower() for name in EXCLUDE_FILE_NAMES}:
            continue

        yield path


def load_watermark() -> Image.Image:
    if not WATERMARK_FILE.exists():
        raise FileNotFoundError(
            f"Watermark file not found:\n{WATERMARK_FILE}\n\n"
            "Copy watermark-monogram.png into the site root."
        )

    return Image.open(WATERMARK_FILE).convert("RGBA")


def resize_watermark(watermark: Image.Image, image_width: int) -> Image.Image:
    target_width = int(image_width * WIDTH_RATIO)
    target_width = max(MIN_WM_WIDTH, min(MAX_WM_WIDTH, target_width))

    scale = target_width / watermark.width
    target_height = max(1, round(watermark.height * scale))

    return watermark.resize(
        (target_width, target_height),
        Image.Resampling.LANCZOS,
    )


def apply_opacity(watermark: Image.Image) -> Image.Image:
    output = watermark.copy()
    alpha = output.getchannel("A")
    alpha = ImageEnhance.Brightness(alpha).enhance(OPACITY)
    output.putalpha(alpha)
    return output


def build_shadow(watermark: Image.Image) -> Image.Image:
    alpha = watermark.getchannel("A")
    blur_radius = max(2, watermark.width // 70)
    alpha = alpha.filter(ImageFilter.GaussianBlur(blur_radius))
    alpha = ImageEnhance.Brightness(alpha).enhance(0.38)

    shadow = Image.new("RGBA", watermark.size, (0, 0, 0, 0))
    shadow.putalpha(alpha)
    return shadow


def save_image(canvas: Image.Image, destination: Path):
    extension = destination.suffix.lower()

    if extension in {".jpg", ".jpeg"}:
        rgb = Image.new("RGB", canvas.size, (0, 0, 0))
        rgb.paste(canvas, mask=canvas.getchannel("A"))
        rgb.save(
            destination,
            quality=JPEG_QUALITY,
            optimize=True,
            progressive=True,
        )
        return

    if extension == ".webp":
        canvas.save(
            destination,
            format="WEBP",
            quality=WEBP_QUALITY,
            method=6,
        )
        return

    canvas.save(destination, optimize=True)


def watermark_image(image_path: Path, watermark_source: Image.Image):
    relative_path = image_path.relative_to(SITE_ROOT)
    backup_path = BACKUP_ROOT / relative_path

    backup_path.parent.mkdir(parents=True, exist_ok=True)

    if not backup_path.exists():
        shutil.copy2(image_path, backup_path)
        clean_source = image_path
        backup_created = True
    elif REPROCESS_FROM_BACKUP:
        clean_source = backup_path
        backup_created = False
    else:
        return "skipped", image_path, False

    with Image.open(clean_source) as opened:
        original = opened.convert("RGBA")

    canvas = Image.new("RGBA", original.size, (0, 0, 0, 0))
    canvas.alpha_composite(original)

    watermark = resize_watermark(watermark_source, original.width)
    watermark = apply_opacity(watermark)
    shadow = build_shadow(watermark)

    padding = max(14, int(min(original.size) * PADDING_RATIO))
    x = max(0, original.width - watermark.width - padding)
    y = max(0, original.height - watermark.height - padding)

    canvas.alpha_composite(shadow, (x + 3, y + 3))
    canvas.alpha_composite(watermark, (x, y))

    save_image(canvas, image_path)

    return "processed", image_path, backup_created


def main():
    print("=" * 76)
    print("PAULBOOTH.AI IMAGE WATERMARKER — V2")
    print("=" * 76)
    print(f"Site root      : {SITE_ROOT}")
    print(f"Watermark      : {WATERMARK_FILE}")
    print(f"Backup folder  : {BACKUP_ROOT}")
    print(f"Opacity        : {OPACITY}")
    print(f"Width ratio    : {WIDTH_RATIO}")
    print("")

    watermark = load_watermark()

    image_paths = []
    for folder in TARGET_DIRS:
        if folder.exists():
            image_paths.extend(iter_images(folder))
        else:
            print(f"[missing folder] {folder}")

    image_paths = sorted(set(image_paths))

    if not image_paths:
        print("No image files were found in content/ or projects/.")
        print("Nothing was changed.")
        return 1

    processed = 0
    backups_created = 0
    failures = 0

    for image_path in image_paths:
        try:
            status, path, backup_created = watermark_image(
                image_path,
                watermark,
            )

            if status == "processed":
                processed += 1
                backups_created += int(backup_created)
                print(f"[watermarked] {path}")
            else:
                print(f"[skipped]     {path}")

        except Exception as error:
            failures += 1
            print(f"[FAILED]      {image_path}")
            print(f"              {error}")

    print("")
    print("=" * 76)
    print("FINISHED")
    print("=" * 76)
    print(f"Watermarked     : {processed}")
    print(f"New backups     : {backups_created}")
    print(f"Failures        : {failures}")
    print("")
    print("Clean originals are stored in:")
    print(BACKUP_ROOT)
    print("")
    print("This V2 script reuses those clean backups when rerun,")
    print("so it does not stack another watermark on top of the old one.")

    return 0 if failures == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
