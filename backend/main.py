import os
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from repositories.job_repository import create_job, get_job, get_jobs_by_user
from repositories.proposal_repository import create_proposal, get_proposals_for_user
from repositories.profile_repository import get_profile, update_profile
from schemas.job import JobRequest
from schemas.proposal import ProposalRequest
from schemas.profile import ProfileRequest
from services.ai_service import check_rate_limit, generate_proposal
from db.database import get_db
from core.auth import get_current_user
from core.config import DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, FRONT_URL

if not DATABASE_URL or not SUPABASE_URL or not SUPABASE_ANON_KEY or not FRONT_URL:
    raise ValueError("One or more required environment variables not set")

app = FastAPI()

# Enable CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONT_URL,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI!", "status": "ok"}

@app.get("/job/{job_id}")
def get_job_endpoint(job_id: str, user_id: str = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get a specific job posting by ID for the authenticated user"""
    job: JobRequest = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if str(job.user_id) != user_id:
        print("Unauthorized access attempt detected")
        raise HTTPException(status_code=403, detail="Not authorized to access this job")
    return {
        "id": str(job.id),
        "title": job.title,
        "description": job.description
    }

@app.get("/jobs")
def get_jobs_endpoint(user_id: str = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all job postings for the authenticated user"""
    jobs = get_jobs_by_user(db, user_id)
    return {"jobs": jobs}

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
    check_rate_limit(user_id)

    user_profile = get_profile(db, user_id)
    job = get_job(db, request.job_id)

    response = generate_proposal(user_profile, job.description)

    proposal = create_proposal(
        db,
        user_id,
        request.job_id,
        response['proposal_text'],
        response['timeline_estimate'],
        response['questions'],
        response['job_analysis']['difficulty_level'],
        response['job_analysis']['match_score'],
        response['job_analysis']['key_skills'],
        response['job_analysis']['estimated_budget_range']
    )

    return {
        "id": str(proposal.id),
        "job_id": str(proposal.job_id),
        "title": job.title,
        "proposal_text": response['proposal_text'],
        "timeline_estimate": response['timeline_estimate'],
        "questions": response['questions'],
        "difficulty_level": response['job_analysis']['difficulty_level'],
        "match_score": response['job_analysis']['match_score'],
        "key_skills": response['job_analysis']['key_skills'],
        "estimated_budget_range": response['job_analysis']['estimated_budget_range']
    }

@app.get("/proposals")
def get_proposals(user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get proposals for the authenticated user from the database"""
    try:
        proposals = get_proposals_for_user(db, user)
        
        return {
            "proposals": proposals
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/profile")
def get_profile_endpoint(user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user profile information"""
    profile = get_profile(db, user)
    if not profile:
        return {
            "full_name": "",
            "headline": "",
            "years_experience": "",
            "primary_role": "",
            "skills": [],
            "bio": ""
        }
    return {
        "full_name": profile.full_name or "",
        "headline": profile.headline or "",
        "years_experience": profile.years_experience or "",
        "primary_role": profile.primary_role or "",
        "skills": profile.skills or [],
        "bio": profile.bio or ""
    }

@app.post("/update_profile")
def update_profile_endpoint(
    request: ProfileRequest,
    user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    update_profile(
        db,
        user,
        request.full_name,
        request.headline,
        request.years_experience,
        request.primary_role,
        request.skills,
        request.bio
    )
    return {"message": "Profile updated successfully"}