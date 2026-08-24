from pathlib import Path
from collections import Counter
import zipfile

ZIP_PATH = Path("ml/dataset/archive (8).zip")
EXTRACT_DIR = Path("ml/dataset/extracted")

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}

print("Checking dataset...")

if not ZIP_PATH.exists():
    print(f"ERROR: Dataset not found: {ZIP_PATH}")
    raise SystemExit(1)

print("Extracting dataset...")

with zipfile.ZipFile(ZIP_PATH, "r") as z:
    z.extractall(EXTRACT_DIR)

print("Extraction complete.\n")

for split_name in ["train", "valid", "test"]:
    matches = list(EXTRACT_DIR.rglob(split_name))

    if not matches:
        print(f"{split_name}: NOT FOUND")
        continue

    split_path = matches[0]

    print("=" * 60)
    print(split_name.upper())
    print("=" * 60)

    total = 0

    for class_dir in sorted(split_path.iterdir()):
        if not class_dir.is_dir():
            continue

        count = sum(
            1
            for f in class_dir.rglob("*")
            if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS
        )

        print(f"{class_dir.name:35} {count}")
        total += count

    print("-" * 60)
    print(f"TOTAL: {total}\n")

print("Dataset audit completed.")