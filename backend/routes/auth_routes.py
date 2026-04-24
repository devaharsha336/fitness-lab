from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import users_collection
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

@router.post("/login")
async def login(req: LoginRequest):
    user = await users_collection.find_one({"email": req.email})
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": req.email})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/change-password")
async def change_password(req: ChangePasswordRequest, current_user: dict = Depends(get_current_user)):
    if req.new_password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    user = await users_collection.find_one({"email": current_user["sub"]})
    if not user or not verify_password(req.current_password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    new_hash = hash_password(req.new_password)
    await users_collection.update_one(
        {"email": current_user["sub"]},
        {"$set": {"hashed_password": new_hash}}
    )
    return {"message": "Password updated successfully"}
