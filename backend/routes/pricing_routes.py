from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from database import pricing_collection
from models import PricingUpdateModel
from auth import get_current_user

router = APIRouter()

def serialize(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.get("")
async def get_pricing():
    packages = await pricing_collection.find().to_list(20)
    return [serialize(p) for p in packages]

@router.put("/{pricing_id}")
async def update_pricing(pricing_id: str, pkg: PricingUpdateModel, _=Depends(get_current_user)):
    updates = {k: v for k, v in pkg.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    await pricing_collection.update_one({"_id": ObjectId(pricing_id)}, {"$set": updates})
    updated = await pricing_collection.find_one({"_id": ObjectId(pricing_id)})
    if not updated:
        raise HTTPException(status_code=404, detail="Package not found")
    return serialize(updated)
