from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Member Schemas
class MemberBase(BaseModel):
    name: str
    phone: str
    status: Optional[str] = "active"

class MemberCreate(MemberBase):
    pass

class Member(MemberBase):
    id: int
    join_date: datetime
    total_check_ins: int

    class Config:
        orm_mode = True

# Plan Schemas
class PlanBase(BaseModel):
    name: str
    price: int
    duration_days: int

class PlanCreate(PlanBase):
    pass

class Plan(PlanBase):
    id: int

    class Config:
        orm_mode = True

# Subscription Schemas
class SubscriptionBase(BaseModel):
    member_id: int
    plan_id: int
    start_date: datetime

class SubscriptionCreate(SubscriptionBase):
    pass

class Subscription(SubscriptionBase):
    id: int
    end_date: datetime

    class Config:
        orm_mode = True

# Attendance Schemas
class AttendanceBase(BaseModel):
    member_id: int

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    check_in_time: datetime

    class Config:
        orm_mode = True
