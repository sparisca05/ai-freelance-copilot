from db.models import Proposal

def get_proposals_for_user(db, user_id):
    return db.query(Proposal).filter(Proposal.user_id == user_id).all()

def create_proposal(db, user_id, job_id, proposal_text, timeline_estimate, questions, difficulty_level, match_score, key_skills, estimated_budget_range):

    proposal = Proposal(
        user_id=user_id,
        job_id=job_id,
        proposal_text=proposal_text,
        timeline_estimate=timeline_estimate,
        questions=questions,
        difficulty_level=difficulty_level,
        match_score=match_score,
        key_skills=key_skills,
        estimated_budget_range=estimated_budget_range
    )

    db.add(proposal)
    db.commit()
    db.refresh(proposal)

    return proposal

def delete_proposal(db, proposal_id):
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if proposal:
        db.delete(proposal)
        db.commit()
        return True
    return False