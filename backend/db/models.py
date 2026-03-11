from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid

from db.database import Base

class Proposal(Base):

    __tablename__ = "proposals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), nullable=False)

    job_description = Column(Text)

    proposal_text = Column(Text)