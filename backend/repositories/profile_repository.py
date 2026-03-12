from db.models import Profile

def get_profile(db, user_id):
    return db.query(Profile).filter(Profile.id == user_id).first()

def update_profile(db, user_id, full_name, headline, years_experience, primary_role, skills, bio):

    profile = db.query(Profile).filter(Profile.id == user_id).first()

    if profile is None:
        profile = Profile(id=user_id)
        db.add(profile)

    profile.full_name = full_name
    profile.headline = headline
    profile.years_experience = years_experience
    profile.primary_role = primary_role
    profile.skills = skills
    profile.bio = bio

    db.commit()
    db.refresh(profile)

    return profile