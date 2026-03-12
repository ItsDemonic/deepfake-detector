import os
import cv2
from tqdm import tqdm

DATASET_PATH = "/mnt/c/Users/Angad Deval/.gemini/antigravity/scratch/deepfake-detector/dataset/real_vs_fake/real-vs-fake"

MIN_SIZE = 128

deleted = 0
checked = 0

for split in ["train", "valid", "test"]:
    for label in ["real", "fake"]:
        folder = os.path.join(DATASET_PATH, split, label)

        for file in tqdm(os.listdir(folder), desc=f"{split}/{label}"):

            path = os.path.join(folder, file)

            checked += 1

            try:

                img = cv2.imread(path)

                if img is None:
                    os.remove(path)
                    deleted += 1
                    continue

                h, w, c = img.shape

                if h < MIN_SIZE or w < MIN_SIZE:
                    os.remove(path)
                    deleted += 1
                    continue
                    
                if len(img.shape) < 3 or c != 3:
                    os.remove(path)
                    deleted += 1
                    continue
            
            except:
                os.remove(path)
                deleted += 1

print()
print("Checked: ", checked)
print("Deleted: ", deleted)
print("Dataset cleaned.")