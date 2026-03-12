from pydantic import BaseModel

class ProfileRequest(BaseModel):
    full_name: str
    headline: str
    years_experience: str
    primary_role: str
    skills: list[str]
    bio: str