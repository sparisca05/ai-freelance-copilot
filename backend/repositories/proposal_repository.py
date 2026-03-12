from db.models import Proposal

def create_proposal(db, user_id, job_id, proposal_text, timeline_estimate, questions):

    proposal = Proposal(
        user_id=user_id,
        job_id=job_id,
        proposal_text=proposal_text,
        timeline_estimate=timeline_estimate,
        questions=questions
    )

    db.add(proposal)
    db.commit()
    db.refresh(proposal)

    return proposal