from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from database import classes_collection
from models import ClassModel, ClassUpdateModel
from auth import get_current_user

router = APIRouter()

def serialize(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.get("")
async def get_classes():
    classes = await classes_collection.find().to_list(100)
    return [serialize(c) for c in classes]

@router.post("")
async def create_class(cls: ClassModel, _=Depends(get_current_user)):
    result = await classes_collection.insert_one(cls.dict())
    created = await classes_collection.find_one({"_id": result.inserted_id})
    return serialize(created)

@router.put("/{class_id}")
async def update_class(class_id: str, cls: ClassUpdateModel, _=Depends(get_current_user)):
    updates = {k: v for k, v in cls.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    await classes_collection.update_one({"_id": ObjectId(class_id)}, {"$set": updates})
    updated = await classes_collection.find_one({"_id": ObjectId(class_id)})
    if not updated:
        raise HTTPException(status_code=404, detail="Class not found")
    return serialize(updated)

@router.delete("/{class_id}")
async def delete_class(class_id: str, _=Depends(get_current_user)):
    result = await classes_collection.delete_one({"_id": ObjectId(class_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Class not found")
    return {"message": "Deleted"}
