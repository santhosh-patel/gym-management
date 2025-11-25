from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas, database

router = APIRouter(
    prefix="/members",
    tags=["members"]
)

@router.post("/", response_model=schemas.Member)
def create_member(member: schemas.MemberCreate, db: Session = Depends(database.get_db)):
    db_member = db.query(models.Member).filter(models.Member.phone == member.phone).first()
    if db_member:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    new_member = models.Member(**member.dict())
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

@router.get("/", response_model=List[schemas.Member])
def read_members(status: Optional[str] = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Member)
    if status:
        query = query.filter(models.Member.status == status)
    return query.all()

@router.get("/{member_id}/current-subscription", response_model=schemas.Subscription)
def get_current_subscription(member_id: int, db: Session = Depends(database.get_db)):
    import datetime
    today = datetime.datetime.now()
    
    subscription = db.query(models.Subscription).filter(
        models.Subscription.member_id == member_id,
        models.Subscription.start_date <= today,
        models.Subscription.end_date >= today
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="No active subscription found")
    return subscription

@router.get("/{member_id}/attendance", response_model=List[schemas.Attendance])
def get_member_attendance(member_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Attendance).filter(models.Attendance.member_id == member_id).all()
