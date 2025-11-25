from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
from .. import models, schemas, database

router = APIRouter(
    prefix="/subscriptions",
    tags=["subscriptions"]
)

@router.post("/", response_model=schemas.Subscription)
def create_subscription(subscription: schemas.SubscriptionCreate, db: Session = Depends(database.get_db)):
    plan = db.query(models.Plan).filter(models.Plan.id == subscription.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    member = db.query(models.Member).filter(models.Member.id == subscription.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    end_date = subscription.start_date + timedelta(days=plan.duration_days)
    
    new_subscription = models.Subscription(
        member_id=subscription.member_id,
        plan_id=subscription.plan_id,
        start_date=subscription.start_date,
        end_date=end_date
    )
    db.add(new_subscription)
    db.commit()
    db.refresh(new_subscription)
    return new_subscription

@router.get("/", response_model=list[schemas.Subscription])
def read_subscriptions(db: Session = Depends(database.get_db)):
    return db.query(models.Subscription).all()
