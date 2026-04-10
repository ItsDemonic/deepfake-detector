from fastapi import APIRouter,Depends
from backend.utils import get_current_user
import backend.schemas as schemas
router=APIRouter()
@router.get('/user',response_model=schemas.User_out)
def user(current_user: dict = Depends(get_current_user)):
    return current_user