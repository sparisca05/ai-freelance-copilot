from pydantic import BaseModel

class ProposalRequest(BaseModel):
    job_description: str