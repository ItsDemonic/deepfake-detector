from fastapi import FastAPI,Depends
from contextlib import asynccontextmanager
from backend.authentication import authentication
from backend.utils import load_model
from database.models import users
from database.db import database_engine, Base
from backend.images.images import router as image_router
from backend.users.users import router as user_router

from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = load_model()
    Base.metadata.create_all(bind=database_engine())
    yield
app=FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify the exact origin "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(authentication.router)
app.include_router(user_router)
app.include_router(image_router)
@app.get('/')
def hello():
    return {"message":"Hello World"}
