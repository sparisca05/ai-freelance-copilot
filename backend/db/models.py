from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
import uuid

from db.database import Base

class Job(Base):

    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), nullable=False)

    title = Column(Text)

    description = Column(Text)

class Proposal(Base):

    __tablename__ = "proposals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), nullable=False)

    job_id = Column(UUID(as_uuid=True), nullable=False)

    proposal_text = Column(Text)

    timeline_estimate = Column(Text)

    questions = Column(JSONB)

class Profile(Base):

    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    full_name = Column(Text)

    headline = Column(Text)

    years_experience = Column(Text)

    primary_role = Column(Text)

    skills = Column(JSONB)

    bio = Column(Text)