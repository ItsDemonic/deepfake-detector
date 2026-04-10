from fastapi import FastAPI,Depends
from contextlib import asynccontextmanager
from backend.authentication import authentication
from backend.utils import load_model
from database.models import users
from backend.images.images import router as image_router
from backend.users.users import router as user_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = load_model()
    yield
app=FastAPI(lifespan=lifespan)
app.include_router(authentication.router)
app.include_router(user_router)
app.include_router(image_router)
@app.get('/')
def hello():
    return {"message":"Hello World"}
