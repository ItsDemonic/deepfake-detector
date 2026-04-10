import torch
import torch.nn as nn
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import timm
import os
from tqdm import tqdm


# Config

BASE_DIR = "dataset/real_vs_fake/real-vs-fake"
TEST_DIR = os.path.join(BASE_DIR, "test")

MODEL_PATH = "effnetv2m_finetuned.pt"

BATCH_SIZE = 32

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Transforms

test_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )

])

# Data

test_data = datasets.ImageFolder(TEST_DIR, test_transform)

test_loader = DataLoader(test_data, batch_size=BATCH_SIZE, shuffle=False, num_workers=4, pin_memory=True)

# Model
model = timm.create_model("tf_efficientnetv2_m.in1k",
    pretrained=True, num_classes=2
)

model.classifier = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(model.classifier.in_features, 2)
)

model.load_state_dict(torch.load(MODEL_PATH))

model = model.to(device)

# Testing

model.eval()

correct = 0
total = 0

with torch.no_grad():
    for imgs, labels in tqdm(test_loader):
        imgs, labels = imgs.to(device), labels.to(device)

        outputs = model(imgs)

        _, preds = torch.max(outputs, 1)

        correct += (preds == labels).sum().item()
        total += labels.size(0)

test_acc = correct / total * 100

print(f"Test Accuracy: {test_acc:.3f}%")