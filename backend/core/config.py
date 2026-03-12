import os
from dotenv import load_dotenv
load_dotenv()

SUPABASE_JWKS_URL = os.getenv("SUPABASE_JWKS_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
FRONT_URL = os.getenv("FRONT_URL", "http://localhost:5173")