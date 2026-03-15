# Deepfake Detector Project

This project aims to implement a deepfake detection system using deep learning techniques.

## Tech Stack

The project utilizes the following technologies and libraries:

- **Deep Learning Framework:** PyTorch
- **Image Processing:** OpenCV (`opencv-python`), Pillow (`pillow`)
- **Web API Framework:** FastAPI
- **ASGI Server:** Uvicorn
- **Data Handling & Processing:** NumPy (`numpy`)
- **Visualization:** Matplotlib (`matplotlib`)
- **Progress Tracking:** tqdm (`tqdm`)
- **Other Utilities:** `python-multipart` (for file uploads in FastAPI)

## Project Structure

- `backend/`: API server implementation.
- `dataset/`: Training and validation datasets.
- `docs/`: Project documentation.
- `frontend/`: User interface implementation.
- `model/`: Deep learning model definitions and training/inference scripts.
- `venv/`: Virtual environment.

## Installation

Ensure you have Python installed, then install the dependencies:

```bash
pip install -r requirements.txt
```

## System Architecture & Design Diagrams

### 1. Overall Architecture
```mermaid
graph TD
    UI[Frontend Client] -->|Upload Media| API[FastAPI Server]
    API -->|Receive & Validate File| Storage[(Temp Storage)]
    API -->|Extract & Align Frames| CV[OpenCV Preprocessing]
    CV -->|Normalized Image Tensors| DL[PyTorch Inference Engine]
    DL -->|Real/Fake Probability Score| API
    API -->|Detection Result Report| UI
```

### 2. Activity Flow Diagram
```mermaid
stateDiagram-v2
    [*] --> UploadMedia
    UploadMedia --> ValidateFormat
    ValidateFormat --> Preprocessing: Valid
    ValidateFormat --> Error: Invalid Format
    Preprocessing --> ExtractFaces
    ExtractFaces --> ModelInference
    ModelInference --> ReturnConfidenceScore
    ReturnConfidenceScore --> [*]
    Error --> [*]
```

### 3. Use-Case View
```mermaid
flowchart LR
    User([End User]) --> U1(Upload Video or Image)
    User --> U2(View Detection Results)
    U1 -.->|includes| P1(Preprocess & Extract Faces)
    P1 -.->|includes| I1(Execute PyTorch Model Inference)
```
