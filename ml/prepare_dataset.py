from pathlib import Path
from collections import defaultdict
import hashlib
import shutil
import random

SOURCE = Path("ml/dataset/extracted")
OUTPUT = Path("ml/dataset/clean")

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}

TRAIN_RATIO = 0.80
VALID_RATIO = 0.10
TEST_RATIO = 0.10

random.seed(42)


def md5_hash(path):
    h = hashlib.md5()

    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)

    return h.hexdigest()


print("Finding dataset...")

dataset_root = None

for path in SOURCE.rglob("train"):
    if (path.parent / "valid").exists() and (path.parent / "test").exists():
        dataset_root = path.parent
        break

if dataset_root is None:
    raise RuntimeError("Could not find train/valid/test folders.")

print(f"Dataset root: {dataset_root}")


# ---------------------------------------------------------
# Collect every image from train/valid/test
# ---------------------------------------------------------

images_by_class = defaultdict(list)

for split in ["train", "valid", "test"]:

    split_dir = dataset_root / split

    for class_dir in split_dir.iterdir():

        if not class_dir.is_dir():
            continue

        for image in class_dir.rglob("*"):

            if (
                image.is_file()
                and image.suffix.lower() in IMAGE_EXTENSIONS
            ):
                images_by_class[class_dir.name].append(image)


print("\nOriginal image counts:")

for cls, images in sorted(images_by_class.items()):
    print(f"{cls:35} {len(images)}")


# ---------------------------------------------------------
# Remove exact duplicate images
# ---------------------------------------------------------

print("\nChecking exact duplicates...")

seen_hashes = set()
unique_images = defaultdict(list)
duplicate_count = 0

for cls, images in images_by_class.items():

    for image in images:

        try:
            file_hash = md5_hash(image)
        except Exception:
            print(f"Could not read: {image}")
            continue

        if file_hash in seen_hashes:
            duplicate_count += 1
            continue

        seen_hashes.add(file_hash)
        unique_images[cls].append(image)


print(f"Exact duplicates removed: {duplicate_count}")


# ---------------------------------------------------------
# Create clean output directory
# ---------------------------------------------------------

if OUTPUT.exists():

    print("\nRemoving previous clean dataset...")

    shutil.rmtree(OUTPUT)


for split in ["train", "valid", "test"]:
    (OUTPUT / split).mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------
# Split data
# ---------------------------------------------------------

print("\nCreating clean dataset...")

total_train = 0
total_valid = 0
total_test = 0

for cls, images in sorted(unique_images.items()):

    random.shuffle(images)

    total = len(images)

    train_end = int(total * TRAIN_RATIO)
    valid_end = train_end + int(total * VALID_RATIO)

    train_images = images[:train_end]
    valid_images = images[train_end:valid_end]
    test_images = images[valid_end:]

    for split, split_images in [
        ("train", train_images),
        ("valid", valid_images),
        ("test", test_images),
    ]:

        class_output = OUTPUT / split / cls
        class_output.mkdir(parents=True, exist_ok=True)

        for index, image in enumerate(split_images):

            destination = class_output / f"{index:05d}_{image.name}"

            shutil.copy2(image, destination)

    total_train += len(train_images)
    total_valid += len(valid_images)
    total_test += len(test_images)

    print(
        f"{cls:35} "
        f"train={len(train_images):4} "
        f"valid={len(valid_images):4} "
        f"test={len(test_images):4}"
    )


# ---------------------------------------------------------
# Final summary
# ---------------------------------------------------------

print("\n" + "=" * 60)
print("CLEAN DATASET CREATED")
print("=" * 60)

print(f"Train:      {total_train}")
print(f"Validation: {total_valid}")
print(f"Test:       {total_test}")
print(f"Total:      {total_train + total_valid + total_test}")

print(f"\nLocation:")
print(OUTPUT.resolve())

print("\nDONE.")