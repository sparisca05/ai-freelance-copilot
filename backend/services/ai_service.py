from openai import OpenAI
import json
import os

from core.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_proposal(job_description: str):

    prompt = f"""
                You are an expert freelancer.

                Write a concise and persuasive freelance proposal for the following job:
                {job_description}

                Return a JSON object with:
                - proposal_text: a short persuasive freelance proposal that highlight expertise and include a friendly closing (max 150 words)
                - timeline_estimate: a short timeline for the project
                - questions: 3 smart questions to ask the client before starting the project
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