from db.models import Profile

def get_profile(db, user_id):
    return db.query(Profile).filter(Profile.id == user_id).first()

def update_profile(db, user_id, full_name, headline, years_experience, primary_role, skills, bio):

    profile = Profile(
        id=user_id,
        full_name=full_name,
        headline=headline,
        years_experience=years_experience,
        primary_role=primary_role,
        skills=skills,
        bio=bio
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile