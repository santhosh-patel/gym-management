from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from .. import models, schemas, database

router = APIRouter(
    prefix="/attendance",
    tags=["attendance"]
)

@router.post("/check-in", response_model=schemas.Attendance)
def check_in(attendance: schemas.AttendanceCreate, db: Session = Depends(database.get_db)):
    # Check for active subscription
    today = datetime.now()
    active_sub = db.query(models.Subscription).filter(
        models.Subscription.member_id == attendance.member_id,
        models.Subscription.start_date <= today,
        models.Subscription.end_date >= today
    ).first()

    if not active_sub:
        raise HTTPException(status_code=400, detail="No active subscription for this member")

    new_attendance = models.Attendance(member_id=attendance.member_id)
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance
