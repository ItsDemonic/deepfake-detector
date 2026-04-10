import timm
import torch

def build_model(arch):

    model = timm.create_model(
        arch,
        pretrained=False,
        num_classes=2
    )

    if "resnet" in arch:

        model.fc = torch.nn.Sequential(
            torch.nn.Dropout(0.5),
            torch.nn.Linear(model.fc.in_features,2)
        )

    elif "efficientnet" in arch:

        model.classifier = torch.nn.Sequential(
            torch.nn.Dropout(0.5),
            torch.nn.Linear(model.classifier.in_features,2)
        )

    elif "mobilenet" in arch:

        model.classifier = torch.nn.Sequential(
            torch.nn.Dropout(0.5),
            torch.nn.Linear(model.classifier.in_features,2)
        )

    elif "xception" in arch:

        model.fc = torch.nn.Sequential(
            torch.nn.Dropout(0.5),
            torch.nn.Linear(model.fc.in_features,2)
        )

    return model