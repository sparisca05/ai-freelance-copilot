import os
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from repositories.job_repository import create_job, get_job
from repositories.proposal_repository import create_proposal
from schemas.job import JobRequest
from schemas.proposal import ProposalRequest
from services.ai_service import generate_proposal
from db.database import get_db
from core.auth import get_current_user
from core.config import DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in environment variables")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError("Supabase environment variables not set")

app = FastAPI()

# Enable CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI!", "status": "ok"}

@app.post("/save_job")
def save_job(
    request: JobRequest,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a new job posting for the authenticated user"""
    
    job = create_job(db, user_id, request.title, request.description)
    return {
        "job_id": str(job.id),
        "message": "Job saved successfully"
    }
    
@app.post("/generate")
def generate_proposal_endpoint(
    request: ProposalRequest,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job_description = get_job(db, request.job_id).description

    response = generate_proposal(job_description)

    proposal = create_proposal(
        db,
        user_id,
        request.job_id,
        response['proposal_text'],
        response['timeline_estimate'],
        response['questions']
    )

    return {
        "id": str(proposal.id),
        "proposal_text": response['proposal_text']
    }
@app.get("/proposals")
def get_proposals(user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get proposals for the authenticated user from the database"""
    try:
        # Example query to test database connection
        # Adjust this based on your actual schema
        result = db.execute(
            text("SELECT 'Database connected successfully!' as message, :user_id as user_id"),
            {"user_id": user}
        )
        data = result.fetchone()
        
        return {
            "user": user,
            "database_status": dict(data._mapping) if data else {},
            "message": "Successfully authenticated with Supabase token"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
@app.post("/update_profile")
def update_profile():
    """Update user profile endpoint (to be implemented)"""
    return {"message": "Profile updated successfully"}