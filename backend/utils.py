from torch.mtia import device
import torch,timm,os
from database.models import users
from fastapi import Depends,HTTPException
from database.db import get_db
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import jwt,JWTError
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import torch
import timm
import torch.nn as nn
load_dotenv(override=True)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def check_user(mail:str,db:Session=Depends(get_db)):
    user=db.query(users).filter(users.email==mail).first()
    return user

def check_user_by_username(username:str,db:Session=Depends(get_db)):
    user=db.query(users).filter(users.username==username).first()
    return user

def hash_password(password:str):
    return pwd_context.hash(password)

def verify_password(password:str,hashed_password:str):
    return pwd_context.verify(password,hashed_password)

oAuth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
def create_access_token(data:dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.now(timezone.utc) + timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    encoded_jwt = jwt.encode(to_encode,os.getenv("SECRET_KEY"),algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt

def get_current_user(token: str = Depends(oAuth2_scheme),db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )   
    try:
        payload = jwt.decode(token,os.getenv("SECRET_KEY"),algorithms=os.getenv("ALGORITHM"))
        user_name = payload.get("username")
        user_id = payload.get("user_id")
        if user_name is None or user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = check_user_by_username(user_name,db)
    if user is None:
        raise credentials_exception
    return user


def load_model(MODEL_STAGE1_PATH = r"C:\Users\acer\Desktop\Personal_projects\deepfake_2\mobilenet_finetuned.pt", device="cpu"):
    print("[INFO] Initializing model creation...")
    model = timm.create_model("mobilenetv3_large_100", pretrained=True, num_classes=2)
    print("[INFO] Model created successfully.")
    model.classifier = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(model.classifier.in_features, 2)
    )
    print("[INFO] Custom classifier attached.")
    print(f"[INFO] Moving model to device: {device}")
    model = model.to(device)
    print(f"[INFO] Loading weights from: {MODEL_STAGE1_PATH}")
    state_dict = torch.load(MODEL_STAGE1_PATH, map_location=device)
    model.load_state_dict(state_dict, strict=False)
    print("[INFO] Weights loaded successfully (with strict=False).")
    print("[INFO] Model is ready for use.")
    return model

