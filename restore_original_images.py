from pathlib import Path
import shutil
import sys

SITE_ROOT = Path(__file__).resolve().parent

BACKUP_ROOTS = [
    SITE_ROOT / "_watermark_backup",
    SITE_ROOT / "_watermark_backups",
    SITE_ROOT / "_watermark_clean_originals",
]

restored = {}
seen_destinations = set()

for backup_root in BACKUP_ROOTS:
    if not backup_root.exists():
        continue

    count = 0

    for backup_file in backup_root.rglob("*"):
        if not backup_file.is_file():
            continue

        relative_path = backup_file.relative_to(backup_root)
        destination = SITE_ROOT / relative_path

        # Earlier clean backups have priority over newer backups.
        if destination in seen_destinations:
            continue

        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(backup_file, destination)
        seen_destinations.add(destination)
        count += 1
        print(f"[restored] {destination}")

    restored[backup_root.name] = count

print("")
if not restored:
    print("No watermark backup folders were found.")
    sys.exit(1)

print("Original images restored.")
for name, count in restored.items():
    print(f"{name}: {count}")
