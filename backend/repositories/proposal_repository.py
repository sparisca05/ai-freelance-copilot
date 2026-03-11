from db.models import Proposal

def create_proposal(db, user_id, job_description, proposal_text):

    proposal = Proposal(
        user_id=user_id,
        job_description=job_description,
        proposal_text=proposal_text
    )

    db.add(proposal)
    db.commit()
    db.refresh(proposal)

    return proposal