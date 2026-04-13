from fastapi import APIRouter, Depends,UploadFile,File,Request, HTTPException
import shutil
from datetime import datetime, timedelta
router = APIRouter(prefix="/images", tags=["Images"])
from backend.images.image_utils import transform_image, predict_image
from backend.utils import get_optional_current_user
from database.db import get_db
from sqlalchemy.orm import Session
from database.models import UnauthenticatedUploads

@router.post("/upload")
def upload_image(request: Request,File: UploadFile = File(...),current_user = Depends(get_optional_current_user), db: Session = Depends(get_db)):
    if current_user is None:
        client_ip = request.client.host
        yesterday = datetime.utcnow() - timedelta(days=1)
        uploads_count = db.query(UnauthenticatedUploads).filter(
            UnauthenticatedUploads.ip_address == client_ip,
            UnauthenticatedUploads.uploaded_at >= yesterday
        ).count()
        
        if uploads_count >= 1:
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Please log in for more uploads.")
        
        new_upload = UnauthenticatedUploads(ip_address=client_ip, uploaded_at=datetime.utcnow())
        db.add(new_upload)
        db.commit()

    with open(f"{File.filename}", "wb") as buffer:
        shutil.copyfileobj(File.file, buffer)
    file_path = f"{File.filename}"
    a = transform_image(file_path)
    prediction, confidence = predict_image(a,device="cpu",model=request.app.state.model)
    return {"filename": File.filename, "prediction": prediction, "confidence": confidence}