from pydantic import BaseModel,EmailStr

class User_Signup(BaseModel):
    username:str
    email:EmailStr
    password:str

class User_out(BaseModel):
    username:str
    email:EmailStr
    class Config:
        from_attributes = True

    