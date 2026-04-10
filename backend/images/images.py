from fastapi import APIRouter, Depends,UploadFile,File,Request
import shutil
router = APIRouter(prefix="/images", tags=["Images"])
from backend.images.image_utils import transform_image, predict_image
from backend.utils import get_current_user

@router.post("/upload")
def upload_image(request: Request,File: UploadFile = File(...),current_user:dict = Depends(get_current_user)):
    with open(f"{File.filename}", "wb") as buffer:
        shutil.copyfileobj(File.file, buffer)
    file_path = f"{File.filename}"
    a = transform_image(file_path)
    b = predict_image(a,device="cpu",model=request.app.state.model)
    return {"filename": File.filename, "prediction": b}