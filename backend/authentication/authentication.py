from fastapi import APIRouter,Depends,HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from database.db import get_db
from sqlalchemy.orm import Session
import backend.schemas as schemas
from backend.utils import check_user,check_user_by_username,hash_password,verify_password,create_access_token
from database import models

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup")
def signup(user:schemas.User_Signup,db:Session=Depends(get_db)):
    try:
        if check_user(user.email,db):
            raise HTTPException(status_code=400,detail="User already exists")
        if check_user_by_username(user.username,db):
            raise HTTPException(status_code=400,detail="Username already exists")
        new_user=models.users(username=user.username,email=user.email,password=hash_password(user.password))
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message":"User created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    users_exists = check_user_by_username(form_data.username,db)
    if not(users_exists):
        raise HTTPException(status_code=404,detail="User does not exist")
    if not(verify_password(password=form_data.password,hashed_password=users_exists.password)):
        raise HTTPException(status_code = 404, detail = "Wrong password")
    access_token = create_access_token(data={"username": users_exists.username, "user_id": users_exists.user_id})
    return {"access_token": access_token, "token_type": "bearer"}
    
    
    



    