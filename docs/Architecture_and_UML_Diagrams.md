# Deepfake Detector: Design & UML Diagrams

This document contains detailed system architecture and UML diagrams for the Deepfake Detector project, generated from the current state of the codebase.

---

## 1. Use Case Diagram
This diagram highlights the main actions available to End Users and the underlying system processes involved.

```mermaid
flowchart LR
    %% Actors
    User([End User])

    %% Main Use Cases
    subgraph Deepfake System
        UC1(Sign Up)
        UC2(Log In)
        UC3(Upload Image for Detection)
        
        %% Internal System processes
        SYS1(Validate Authentication Token)
        SYS2(Preprocess & Transform Image)
        SYS3(Execute MobileNetV3 Inference)
        SYS4(Store Image Metadata & Paths)
    end

    %% Actor to Use Cases
    User --> UC1
    User --> UC2
    User --> UC3

    %% Use Case relationships
    UC3 -.->|requires| UC2
    UC3 -.->|includes| SYS1
    UC3 -.->|includes| SYS2
    SYS2 -.->|includes| SYS3
    SYS3 -.->|extends| SYS4
```

---

## 2. Class Diagram
This diagram outlines the primary Database Models and Pydantic Schemas used for Object-Relational Mapping (ORM) and API validation.

```mermaid
classDiagram
    %% SQLAlchemy Models
    class users {
        +int user_id
        +String username
        +String email
        +String password
        +relationship image
    }

    class images {
        +int image_id
        +String filename
        +String bucket_path
        +String public_url
        +DateTime uploaded_at
        +int user_id
        +relationship user
    }

    %% Pydantic Schemas
    class User_Signup {
        +String username
        +EmailStr email
        +String password
    }

    class User_out {
        +String username
        +EmailStr email
    }

    %% Relationships
    users "1" *-- "0..*" images : has many uploads
    users ..> User_Signup : validated by
    users ..> User_out : serialized to
```

---

## 3. Activity Diagram
This traces the flow of logic taking place when an Image Upload is requested on the `/images/upload` endpoint.

```mermaid
stateDiagram-v2
    [*] --> RequestReceived: Client triggers /images/upload

    state RequestReceived {
        [*] --> CheckToken
        CheckToken --> ValidToken : Token OK
        CheckToken --> Unauthorized : Token Invalid/Expired
    }

    ValidToken --> SaveImageTemp: Copy file locally
    Unauthorized --> [*]: Return 401 Error
    
    SaveImageTemp --> Preprocessing: Send file path
    
    state Preprocessing {
        [*] --> ResizeTo224
        ResizeTo224 --> ToTensor
        ToTensor --> NormalizeRGB
        NormalizeRGB --> AddBatchDim
        AddBatchDim --> [*]
    }
    
    Preprocessing --> Inference: Pass torch.Tensor
    
    state Inference {
        [*] --> LoadModel: MobileNetV3
        LoadModel --> ForwardPass
        ForwardPass --> FindMaxProbability
        FindMaxProbability --> MapClasses: 0->Fake, 1->Real
        MapClasses --> [*]
    }
    
    Inference --> ReturnResult: JSON Response
    ReturnResult --> [*]
```

---

## 4. Sequence Diagram
This portrays the chronological interactions between the system's components during an image upload and prediction cycle.

```mermaid
sequenceDiagram
    actor Client
    participant API as FastAPI Server (images.py)
    participant Auth as Auth Utils (utils.py)
    participant DB as SQLite / Relational DB
    participant ImgUtils as Image Utils (image_utils.py)
    participant Model as MobileNetV3 (PyTorch)

    Client->>API: POST /images/upload (File + Token)
    API->>Auth: get_current_user(token)
    Auth->>Auth: Decode Token (jwt.decode)
    Auth->>DB: Query User by Username
    DB-->>Auth: Return User Instance
    Auth-->>API: User Authenticated payload
    
    API->>API: Save File temporarily (shutil.copyfileobj)
    
    API->>ImgUtils: transform_image(filename)
    ImgUtils-->>API: torch.Tensor (1, 3, 224, 224)
    
    API->>ImgUtils: predict_image(tensor, cpu)
    ImgUtils->>Model: Forward pass tensor
    Model-->>ImgUtils: Prediction Output Weights
    ImgUtils->>ImgUtils: Interpret Class ('Real' / 'Fake')
    ImgUtils-->>API: Prediction String
    
    API-->>Client: HTTP 200 OK {filename, prediction}
```

---

## 5. Data Architecture Diagram
This diagrams out how user and asset metadata is structured alongside internal systems.

```mermaid
flowchart TD
    %% Services
    client([Client / Frontend])
    server[FastAPI Server]
    
    %% Databases & Storage
    db[(Relational DB: Users & image metadata)]
    tempdisk[(Temporary Filesystem)]
    bucket[(Blob Bucket for Images)]
    weights[(.pt Model Weights)]

    %% Connections
    client <--> server
    server <--> db
    server <--> tempdisk
    server <--> bucket
    server <--> weights
```

*(Below is the Entity-Relationship flow for strict database data architecture.)*

```mermaid
erDiagram
    Users ||--o{ Images : uploads
    Users {
        int user_id PK
        string username
        string email
        string password "Hashed via passlib"
    }
    Images {
        int image_id PK
        string filename
        string bucket_path "S3/Blob Reference"
        string public_url
        datetime uploaded_at
        int user_id FK
    }
```
