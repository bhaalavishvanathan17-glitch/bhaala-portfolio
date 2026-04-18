import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_KEY", "")

supabase_admin: Client = create_client(url, key) if url and key else None
