import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import timm
from tqdm import tqdm
import os

# Intial Configuration

BASE_DIR = "dataset/real_vs_fake/real-vs-fake"

TRAIN_DIR = os.path.join(BASE_DIR, "train")
VALID_DIR = os.path.join(BASE_DIR, "valid")

BATCH_SIZE = 32
LR = 1e-3
WEIGHT_DECAY = 1e-4
EPOCHS = 10

MODEL_STAGE1_PATH = "mobilenet_feature_extract.pt"


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# Transforms

train_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(0.3, 0.3, 0.3, 0.1),
    transforms.RandomGrayscale(p=0.1),
    transforms.GaussianBlur(3),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
    [0.229, 0.224, 0.225])
])

test_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
    [0.229, 0.224, 0.225])
])

train_data = datasets.ImageFolder(TRAIN_DIR, train_transform)
valid_data = datasets.ImageFolder(VALID_DIR, test_transform)

train_loader = DataLoader(train_data, batch_size = BATCH_SIZE, shuffle = True, num_workers = 4, pin_memory = True)
valid_loader = DataLoader(valid_data, batch_size = BATCH_SIZE, shuffle = False, num_workers = 4, pin_memory = True)

# Model

model = timm.create_model("mobilenetv3_large_100", pretrained=True, num_classes=2)
model.classifier = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(model.classifier.in_features, 2)
)
model = model.to(device)

# Freezing the backbone

for name, p in model.named_parameters():
    if "classifier" not in name:
        p.requires_grad = False

criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(filter(lambda p : p.requires_grad, model.parameters()),
lr = LR, weight_decay = WEIGHT_DECAY)

print("Training feature extraction... ")

for epoch in range(EPOCHS):
    model.train()

    train_correct = 0
    train_total = 0
    
    for imgs, labels in tqdm(train_loader):
        imgs, labels= imgs.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        _, preds = torch.max(outputs, 1)
        train_correct += (preds==labels).sum().item()
        train_total += labels.size(0)
    
    train_acc = train_correct/train_total

    # Validation
    model.eval()
    val_correct = 0
    val_total = 0
    with torch.no_grad():
        for imgs, labels in valid_loader:
            imgs, labels = imgs.to(device), labels.to(device)
            outputs = model(imgs)

            _, preds = torch.max(outputs, 1)
            val_correct += (preds == labels).sum().item()
            val_total += labels.size(0)
    val_acc = val_correct / val_total * 100


    print(f"Epoch {epoch+1} | Train acc: {train_acc:.4f}% | Val Acc: {val_acc:.4f}%")

torch.save(model.state_dict(), MODEL_STAGE1_PATH)
print("Stage 1 model saved:", MODEL_STAGE1_PATH)