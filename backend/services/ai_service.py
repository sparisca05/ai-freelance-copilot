from openai import OpenAI
import json
import os

from db.models import Profile
from core.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_proposal(user_profile: Profile, job_description: str):
    # Use profile information to create a more personalized proposal
    full_name = user_profile.full_name or "The freelancer"
    headline = user_profile.headline or "Experienced professional"
    years_experience = user_profile.years_experience or "no specific years of experience"
    primary_role = user_profile.primary_role or "no specific role listed"
    skills = ", ".join(user_profile.skills) if user_profile.skills else "no specific skills listed"
    bio = user_profile.bio or "No bio available."

    prompt = f"""
            You are an expert freelance consultant helping developers decide whether to apply to jobs and write winning proposals.

            Analyze the match between the freelancer's profile and the following job post carefully.

            FREELANCER PROFILE:
            Name: {full_name}
            Headline: {headline}
            Years of Experience: {years_experience}
            Primary Role: {primary_role}
            Skills: {skills}
            Bio: {bio}

            JOB POST:
            {job_description}

            ----------------------------------------------------------------

            Return a JSON object with the following fields:

            proposal_text:
            A persuasive freelance proposal written as an email to the recruiter. Maximum 150 words.

            timeline_estimate:
            A realistic timeline for completing the project.

            questions:
            3 intelligent questions the freelancer should ask the client before starting.

            job_analysis:
            An object with the following fields:

                difficulty_level:
                One of: easy, medium, hard

                match_score:
                A number from 0 to 100 indicating how well a typical full-stack freelancer could match this job.

                key_skills:
                A list of the most important technical skills mentioned in the job post.

                estimated_budget_range:
                An approximate budget range that projects like this usually have.

            Return ONLY valid JSON.
            """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You help freelancers win projects."},
            {"role": "user", "content": prompt}
        ]
    )
    return json.loads(response.choices[0].message.content)