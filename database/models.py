from sqlalchemy.orm import relationship
from database.db import Base
from sqlalchemy import Column, Integer, String,ForeignKey,DateTime
from datetime import datetime
class users(Base):
    __tablename__ = "Users"
    user_id = Column(Integer, primary_key=True,index=True )
    username = Column(String,unique=True,nullable=False)
    email = Column(String,unique=True,nullable=False)
    password = Column(String,nullable=False)
    image = relationship("images",back_populates="user")

class images(Base):
    __tablename__ = "Images"
    image_id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    bucket_path = Column(String, nullable=False)   # path inside the bucket
    public_url  = Column(String, nullable=False)   # full public URL
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer,ForeignKey("Users.user_id"))
    user = relationship("users",back_populates="image")
    
