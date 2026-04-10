import torch
from torchvision import transforms
from PIL import Image

# 1. Transform function
def transform_image(image_path):
    """
    Apply preprocessing transforms to an image so it can be sent to the model.
    
    Args:
        image_path (str): Path to the image file
    
    Returns:
        torch.Tensor: Preprocessed image tensor with batch dimension
    """
    predict_transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
    ])
    
    img = Image.open(image_path).convert("RGB")
    img_t = predict_transform(img).unsqueeze(0)  # add batch dimension
    return img_t

def predict_image(image_tensor, device,model):
    """
    Predict whether the image is real or fake.
    
    Args:
        model: Trained PyTorch model
        image_tensor (torch.Tensor): Preprocessed image tensor
        device: 'cuda' or 'cpu'
    
    Returns:
        str: 'Real' or 'Fake'
    """
    model.eval()
    image_tensor = image_tensor.to(device)
    with torch.no_grad():
        outputs = model(image_tensor)
        _, pred = torch.max(outputs, 1)
    
    class_names = ["Fake", "Real"]  # adjust if dataset labels differ
    return class_names[pred.item()]