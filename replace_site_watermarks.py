from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter
import shutil
import sys

# ============================================================
# PAULBOOTH.AI — COMPLETE SITE WATERMARK REPLACEMENT
# ============================================================
#
# This script replaces the previous burned-in watermark with the exact
# horned-skull silhouette supplied by Paul Booth.
#
# It first looks for clean originals created by earlier watermark scripts:
#   _watermark_backup\
#   _watermark_backups\
#
# When a clean backup exists, that backup is used as the source. This removes
# the old watermark before applying the new one.
#
# When no earlier backup exists, the current file is treated as the original,
# copied into _watermark_clean_originals\, and then watermarked.
#
# Supported image formats:
#   PNG, JPG, JPEG, WEBP
#
# The script scans artwork/media inside:
#   content\
#   projects\
#
# It intentionally does not alter interface logos, favicons, background tiles,
# or the watermark files themselves.

SITE_ROOT = Path(__file__).resolve().parent
WATERMARK_FILE = SITE_ROOT / "paulbooth-skull-watermark.png"

TARGET_DIRS = [
    SITE_ROOT / "content",
    SITE_ROOT / "projects",
]

EARLIER_BACKUP_ROOTS = [
    SITE_ROOT / "_watermark_backup",
    SITE_ROOT / "_watermark_backups",
]

NEW_CLEAN_BACKUP_ROOT = SITE_ROOT / "_watermark_clean_originals"

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}

EXCLUDED_DIR_NAMES = {
    ".git",
    ".github",
    "__pycache__",
    "node_modules",
    ".venv",
    "venv",
    "_watermark_backup",
    "_watermark_backups",
    "_watermark_clean_originals",
}

# These name fragments are normally site chrome rather than artwork.
EXCLUDED_NAME_FRAGMENTS = {
    "favicon",
    "site-logo",
    "paulbooth-ai-logo",
    "paulbooth.ai-logo",
    "wordmark",
    "monogram",
    "watermark",
    "page-background-tile",
    "background-tile",
    "page-noise",
}

# Watermark appearance.
# The supplied symbol is tall, so 8.5% of image width remains subtle.
WIDTH_RATIO = 0.085
MIN_WATERMARK_WIDTH = 60
MAX_WATERMARK_WIDTH = 220
OPACITY = 0.22
EDGE_MARGIN_RATIO = 0.018
POSITION = "bottom-right"

JPEG_QUALITY = 95
WEBP_QUALITY = 95

# Skip tiny UI-sized files.
MIN_IMAGE_WIDTH = 320
MIN_IMAGE_HEIGHT = 240


def is_excluded(path: Path) -> bool:
    lower_name = path.name.lower()

    if path.resolve() == WATERMARK_FILE.resolve():
        return True

    if any(part.lower() in EXCLUDED_DIR_NAMES for part in path.parts):
        return True

    return any(fragment in lower_name for fragment in EXCLUDED_NAME_FRAGMENTS)


def iter_target_images():
    seen = set()

    for target_dir in TARGET_DIRS:
        if not target_dir.exists():
            print(f"[missing target folder] {target_dir}")
            continue

        for path in target_dir.rglob("*"):
            if not path.is_file():
                continue

            if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
                continue

            if is_excluded(path):
                continue

            resolved = path.resolve()
            if resolved in seen:
                continue

            seen.add(resolved)
            yield path


def locate_clean_source(image_path: Path) -> tuple[Path, str]:
    relative_path = image_path.relative_to(SITE_ROOT)

    # Prefer the clean backups created before the old watermark was burned in.
    for backup_root in EARLIER_BACKUP_ROOTS:
        candidate = backup_root / relative_path
        if candidate.exists() and candidate.is_file():
            return candidate, backup_root.name

    # No earlier backup: preserve the current file as the clean original.
    clean_backup = NEW_CLEAN_BACKUP_ROOT / relative_path
    if not clean_backup.exists():
        clean_backup.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(image_path, clean_backup)

    return clean_backup, NEW_CLEAN_BACKUP_ROOT.name


def load_watermark() -> Image.Image:
    if not WATERMARK_FILE.exists():
        raise FileNotFoundError(
            f"Missing watermark file:\n{WATERMARK_FILE}\n\n"
            "Copy paulbooth-skull-watermark.png into the site root."
        )

    watermark = Image.open(WATERMARK_FILE).convert("RGBA")

    alpha = watermark.getchannel("A")
    alpha = ImageEnhance.Brightness(alpha).enhance(OPACITY)
    watermark.putalpha(alpha)

    return watermark


def resize_watermark(watermark: Image.Image, image_width: int) -> Image.Image:
    target_width = round(image_width * WIDTH_RATIO)
    target_width = max(
        MIN_WATERMARK_WIDTH,
        min(MAX_WATERMARK_WIDTH, target_width),
    )

    scale = target_width / watermark.width
    target_height = max(1, round(watermark.height * scale))

    return watermark.resize(
        (target_width, target_height),
        Image.Resampling.LANCZOS,
    )


def create_shadow(watermark: Image.Image) -> Image.Image:
    alpha = watermark.getchannel("A")
    blur_radius = max(2, watermark.width // 55)
    alpha = alpha.filter(ImageFilter.GaussianBlur(blur_radius))
    alpha = ImageEnhance.Brightness(alpha).enhance(0.48)

    shadow = Image.new("RGBA", watermark.size, (0, 0, 0, 0))
    shadow.putalpha(alpha)
    return shadow


def calculate_position(
    image_size: tuple[int, int],
    watermark_size: tuple[int, int],
) -> tuple[int, int]:
    image_width, image_height = image_size
    watermark_width, watermark_height = watermark_size

    margin = max(12, round(min(image_size) * EDGE_MARGIN_RATIO))

    if POSITION == "bottom-left":
        return margin, image_height - watermark_height - margin

    if POSITION == "top-right":
        return image_width - watermark_width - margin, margin

    if POSITION == "top-left":
        return margin, margin

    return (
        image_width - watermark_width - margin,
        image_height - watermark_height - margin,
    )


def save_output(image: Image.Image, destination: Path):
    extension = destination.suffix.lower()

    if extension in {".jpg", ".jpeg"}:
        flattened = Image.new("RGB", image.size, (0, 0, 0))
        flattened.paste(image, mask=image.getchannel("A"))
        flattened.save(
            destination,
            quality=JPEG_QUALITY,
            optimize=True,
            progressive=True,
        )
        return

    if extension == ".webp":
        image.save(
            destination,
            format="WEBP",
            quality=WEBP_QUALITY,
            method=6,
        )
        return

    image.save(destination, optimize=True)


def replace_watermark(
    image_path: Path,
    watermark_source: Image.Image,
) -> tuple[str, str]:
    clean_source, source_name = locate_clean_source(image_path)

    with Image.open(clean_source) as opened:
        image = opened.convert("RGBA")

    if image.width < MIN_IMAGE_WIDTH or image.height < MIN_IMAGE_HEIGHT:
        return "skipped-small", source_name

    watermark = resize_watermark(watermark_source, image.width)
    shadow = create_shadow(watermark)

    x, y = calculate_position(image.size, watermark.size)

    canvas = Image.new("RGBA", image.size, (0, 0, 0, 0))
    canvas.alpha_composite(image)

    # A restrained dark shadow keeps the white symbol visible on light artwork.
    canvas.alpha_composite(shadow, (x + 3, y + 3))
    canvas.alpha_composite(watermark, (x, y))

    save_output(canvas, image_path)
    return "watermarked", source_name


def main() -> int:
    print("=" * 78)
    print("PAULBOOTH.AI — COMPLETE SITE WATERMARK REPLACEMENT")
    print("=" * 78)
    print(f"Site root : {SITE_ROOT}")
    print(f"Watermark : {WATERMARK_FILE}")
    print("")
    print("The script will restore each image from an earlier clean backup when")
    print("available, then burn in the new horned-skull watermark.")
    print("")

    watermark = load_watermark()
    images = sorted(iter_target_images())

    if not images:
        print("No eligible images were found inside content\\ or projects\\.")
        return 1

    watermarked = 0
    skipped_small = 0
    failures = 0
    restored_from = {}

    for image_path in images:
        try:
            status, source_name = replace_watermark(image_path, watermark)

            if status == "watermarked":
                watermarked += 1
                restored_from[source_name] = restored_from.get(source_name, 0) + 1
                print(f"[watermarked] {image_path}")
            else:
                skipped_small += 1
                print(f"[skipped: too small] {image_path}")

        except Exception as error:
            failures += 1
            print(f"[FAILED] {image_path}")
            print(f"         {error}")

    print("")
    print("=" * 78)
    print("FINISHED")
    print("=" * 78)
    print(f"Watermarked : {watermarked}")
    print(f"Skipped     : {skipped_small}")
    print(f"Failures    : {failures}")

    if restored_from:
        print("")
        print("Source originals used:")
        for source_name, count in sorted(restored_from.items()):
            print(f"  {source_name}: {count}")

    print("")
    print("New clean backups for previously unprocessed files are stored in:")
    print(NEW_CLEAN_BACKUP_ROOT)

    return 0 if failures == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
