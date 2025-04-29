from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List, Optional
import bcrypt
import jwt
from datetime import datetime, timedelta

# Initialize FastAPI
app = FastAPI()

# JWT Configuration
SECRET_KEY = "your-secret-key"  # In production, use a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# MongoDB Connection
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "leave_management"
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Utility function to hash passwords
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Utility function to verify password
def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# Utility function to create access token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Pydantic Models
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str  # "employee" or "manager"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LeaveApplicationBase(BaseModel):
    employee_id: str
    start_date: str
    end_date: str
    status: str  # "pending", "approved", "rejected"

class LeaveApplicationCreate(LeaveApplicationBase):
    pass

class LeaveApplicationResponse(LeaveApplicationBase):
    id: str

class LeaveBalance(BaseModel):
    employee_id: str
    available_leaves: int
    used_leaves: int

# Register User
@app.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    try:
        existing_user = await db.users.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = hash_password(user.password)
        user_dict = user.dict()
        user_dict["password"] = hashed_password
        
        result = await db.users.insert_one(user_dict)
        user_dict["id"] = str(result.inserted_id)
        del user_dict["password"]  # Remove password from response
        
        return user_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Login
@app.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    try:
        user = await db.users.find_one({"email": login_data.email})
        if not user or not verify_password(login_data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user["_id"])}, expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get User Details
@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user["id"] = str(user["_id"])
        del user["password"]
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Apply for Leave
@app.post("/leave-application", response_model=LeaveApplicationResponse)
async def apply_leave(leave: LeaveApplicationCreate):
    result = await db.leave_applications.insert_one(leave.dict())
    return {"id": str(result.inserted_id), **leave.dict()}

# Get Leave Applications (for managers)
@app.get("/leave-applications", response_model=List[LeaveApplicationResponse])
async def get_leave_applications():
    leaves = await db.leave_applications.find().to_list(100)
    return [{"id": str(leave["_id"]), **leave} for leave in leaves]

# Approve/Reject Leave Application
@app.put("/leave-application/{leave_id}")
async def update_leave_status(leave_id: str, status: str):
    result = await db.leave_applications.update_one({"_id": ObjectId(leave_id)}, {"$set": {"status": status}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Leave application not found")
    return {"message": "Leave status updated successfully"}

# Get Leave Balance
@app.get("/leave-balance/{employee_id}", response_model=LeaveBalance)
async def get_leave_balance(employee_id: str):
    balance = await db.leave_balances.find_one({"employee_id": employee_id})
    if not balance:
        raise HTTPException(status_code=404, detail="Leave balance not found")
    return balance
