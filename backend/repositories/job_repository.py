from db.models import Job

def get_job(db, job_id):
    return db.query(Job).filter(Job.id == job_id).first()

def get_jobs_by_user(db, user_id):
    return db.query(Job).filter(Job.user_id == user_id).all()

def create_job(db, user_id, title, description):

    job = Job(
        user_id=user_id,
        title=title,
        description=description
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return job