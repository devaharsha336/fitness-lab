from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from database import pricing_collection
from models import PricingModel, PricingUpdateModel
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

@router.post("")
async def create_pricing(pkg: PricingModel, _=Depends(get_current_user)):
    result = await pricing_collection.insert_one(pkg.dict())
    created = await pricing_collection.find_one({"_id": result.inserted_id})
    return serialize(created)

@router.put("/{pricing_id}")
async def update_pricing(pricing_id: str, pkg: PricingUpdateModel, _=Depends(get_current_user)):
    try:
        oid = ObjectId(pricing_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid pricing ID")
    updates = {k: v for k, v in pkg.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    await pricing_collection.update_one({"_id": oid}, {"$set": updates})
    updated = await pricing_collection.find_one({"_id": oid})
    if not updated:
        raise HTTPException(status_code=404, detail="Package not found")
    return serialize(updated)

@router.delete("/{pricing_id}")
async def delete_pricing(pricing_id: str, _=Depends(get_current_user)):
    try:
        oid = ObjectId(pricing_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid pricing ID")
    result = await pricing_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    return {"message": "Deleted"}
