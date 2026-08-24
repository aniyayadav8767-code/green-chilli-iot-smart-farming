from pathlib import Path
from collections import defaultdict
import hashlib

DATASET_DIR = Path("ml/dataset/extracted")

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}

splits = {}

for split_name in ["train", "valid", "test"]:
    matches = list(DATASET_DIR.rglob(split_name))
    if matches:
        splits[split_name] = matches[0]

hashes = defaultdict(list)

for split_name, split_path in splits.items():
    print(f"Scanning {split_name}...")

    for file in split_path.rglob("*"):
        if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS:
            file_hash = hashlib.md5(file.read_bytes()).hexdigest()
            hashes[file_hash].append((split_name, str(file)))

print("\n" + "=" * 60)
print("DUPLICATE ANALYSIS")
print("=" * 60)

duplicate_groups = 0
cross_split_duplicates = 0

for file_hash, files in hashes.items():

    if len(files) > 1:
        duplicate_groups += 1

        split_names = set(split for split, _ in files)

        if len(split_names) > 1:
            cross_split_duplicates += 1

            print("\nCross-split duplicate:")
            for split, path in files:
                print(f"  {split}: {path}")

print("\n" + "-" * 60)
print(f"Duplicate groups: {duplicate_groups}")
print(f"Cross-split duplicate groups: {cross_split_duplicates}")
print("-" * 60)