from pydantic import BaseModel

class ProposalRequest(BaseModel):
    job_id: str