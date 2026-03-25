import torch
import numpy as np
import time 
import os
import pandas as pd 
import timm
import seaborn as sns
from helper_build_model import build_model

from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    roc_auc_score,
    roc_curve,
    precision_score,
    recall_score,
    f1_score
)
import matplotlib.pyplot as plt


from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# Config

BASE_DIR = "dataset/real_vs_fake/real-vs-fake"

TEST_DIR = os.path.join(BASE_DIR, "test")

os.makedirs("results",exist_ok=True)

test_transform = transforms.Compose([

    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

test_data = datasets.ImageFolder(TEST_DIR, test_transform)

test_loader = DataLoader(

    test_data,

    batch_size = 32,

    shuffle = False,

    num_workers = 4,

    pin_memory = True
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

results = []

roc_storage = {}

# Evaluation Function

def evaluate_model(model, test_loader, model_name):
    print(f"\nEvaluating {model_name}...")
    if torch.cuda.is_available():
        torch.cuda.reset_peak_memory_stats()
    model.eval()

    all_preds = []
    all_labels = []
    all_probs = []

    if torch.cuda.is_available():
        torch.cuda.synchronize()
    start_time = time.time()


    with torch.no_grad():
        for imgs, labels in test_loader:

            imgs = imgs.to(device, non_blocking = True)
            labels = labels.to(device, non_blocking = True)

            outputs = model(imgs)

            probs = torch.softmax(outputs, dim = 1)[:,1]

            preds = torch.argmax(outputs, 1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            all_probs.extend(probs.cpu().numpy())

    if torch.cuda.is_available():
        torch.cuda.synchronize()
    end_time = time.time()

    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)
    all_probs = np.array(all_probs)

    # Performance

    acc = (all_preds == all_labels).mean()*100

    precision = precision_score(all_labels, all_preds, zero_division=0)

    recall = recall_score(all_labels, all_preds, zero_division=0)

    f1 = f1_score(all_labels, all_preds, zero_division=0)

    auc = roc_auc_score(all_labels, all_probs)

    cm = confusion_matrix(all_labels, all_preds)

    tn, fp, fn, tp = cm.ravel()

    fp_rate = fp/(fp+tn) if (fp+tn) > 0 else 0

    fn_rate = fn/(fn+tp) if (fn+tp) > 0 else 0


    # Speed

    total_time = end_time - start_time

    total_images = len(test_loader.dataset)

    img_per_sec = total_images / total_time

    # Parameters

    total_params = sum(p.numel() for p in model.parameters())

    trainable_params = sum(
        p.numel() for p in model.parameters() if p.requires_grad
    )

    efficiency = f1/(total_params/1e6) if total_params>0 else 0

    # Model Size

    temp_name = model_name + "_temp.pt"

    torch.save(model.state_dict(), temp_name)

    size_mb = os.path.getsize(temp_name)/1024/1024

    os.remove(temp_name)

    # ROC

    fpr, tpr, _ = roc_curve(all_labels, all_probs)

    roc_storage[model_name] = (fpr, tpr, auc)

    # Saving Important Data

    np.save("results/"+model_name+"_preds.npy", all_probs)

    np.save("results/"+model_name+"_labels.npy", all_labels)

    np.save("results/"+model_name+"_confusion_matrix.npy", cm)

    np.save("results/"+model_name+"_roc_fpr.npy", fpr)

    np.save("results/"+model_name+"_roc_tpr.npy", tpr)

    # Saving text report

    report = classification_report(all_labels, all_preds, digits = 5)

    with open("results/"+model_name + "_report.txt", "w") as f:

        f.write(report)
    
    # Print Summary

    print("\n====================")

    print(model_name)

    print("====================")

    print(f"Accuracy: {acc:.4f}")

    print(f"F1: {f1:.5f}")

    print(f"AUC: {auc:.5f}")

    print(f"Efficiency: {efficiency:.5f}")

    print(f"Images/sec: {img_per_sec:.2f}")

    print(f"Params: {total_params/1e6:.2f} M")

    if torch.cuda.is_available():
        print("GPU memory:",
        torch.cuda.max_memory_allocated()/1024/1024/1024,
        "GB")

    # Store for final table

    results.append({
        "Model":model_name,
        
        "Accuracy":acc,

        "F1":f1,

        "Precision":precision,

        "Recall":recall,

        "AUROC":auc,

        "Params(M)":total_params/1e6,

        "Trainable(M)":trainable_params/1e6,

        "Images/sec":img_per_sec,

        "Model size MB":size_mb,

        "Inference time":total_time,

        "FPR":fp_rate,

        "FNR":fn_rate,

        "F1/Params":efficiency,
    })

    print(f"Done: {model_name}")




# Evaluate all models

models = [

("resnet_partial","resnet50","resnet50_finetuned.pt"),

("effnet_partial","tf_efficientnetv2_m.in1k","effnetv2m_finetuned.pt"),

("mobilenet_partial","mobilenetv3_large_100","mobilenet_finetuned.pt"),

("xception_partial","xception","xception_finetuned.pt")

]

for name,arch,path in models:

    model = build_model(arch)

    model.load_state_dict(torch.load(path, map_location=device))

    model = model.to(device)

    evaluate_model(model,test_loader,name)


# Plot ROC Comparison

plt.figure(figsize=(8,6))

for model_name in sorted(roc_storage,
                         key=lambda x: roc_storage[x][2],
                         reverse=True):

    fpr,tpr,auc = roc_storage[model_name]

    plt.plot(fpr,tpr,label=f"{model_name} AUC={auc:.4f}")

plt.plot([0,1],[0,1],'k--')

plt.xlabel("False Positive Rate")

plt.ylabel("True Positive Rate")

plt.title("ROC Comparison")

plt.legend()

plt.grid()

plt.savefig("results/roc_comparison.png")

plt.show()

# Plot Confusion Matrix

for r in results:

    name = r["Model"]

    cm = np.load("results/"+name+"_confusion_matrix.npy")

    cm_norm = cm/cm.sum(axis=1,keepdims=True)

    plt.figure()

    sns.heatmap(cm_norm,
                annot=True,
                fmt=".3f",
                cmap="Blues")

    plt.title(name)

    plt.savefig("results/"+name+"_cm.png")

    plt.close()

# Save Final Comp Tables

df = pd.DataFrame(results)

df = df.sort_values("F1",ascending=False)

print("\nFinal Comparison:")

print(df)

df.to_csv("results/model_comparison.csv",index=False)