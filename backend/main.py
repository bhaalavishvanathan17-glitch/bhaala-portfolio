from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ContactForm, RegisteredUser
from supabase_client import supabase_admin
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from pathlib import Path
from datetime import datetime
import os

app = FastAPI(title="Bhaala Portfolio API", version="1.0.0")

# ── CORS ──────────────────────────────────────
origins = [
    "http://localhost:5173",
    "https://your-portfolio.netlify.app",
    os.getenv("FRONTEND_URL", "*"),
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Excel config ──────────────────────────────
EXCEL_FILE = Path(__file__).parent / "registered_users.xlsx"
HEADERS    = ["Full Name", "Email", "Phone", "Registered At"]

def get_or_create_workbook():
    """Return (workbook, worksheet), creating the file + header row if needed."""
    if EXCEL_FILE.exists():
        wb = openpyxl.load_workbook(EXCEL_FILE)
        ws = wb.active
    else:
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Registered Users"

        # Header row styling
        header_fill = PatternFill("solid", fgColor="6C0B0B")   # dark red
        header_font = Font(bold=True, color="FFFFFF", size=12)

        for col, title in enumerate(HEADERS, start=1):
            cell = ws.cell(row=1, column=col, value=title)
            cell.font      = header_fill and header_font
            cell.fill      = header_fill
            cell.alignment = Alignment(horizontal="center")

        ws.column_dimensions["A"].width = 26
        ws.column_dimensions["B"].width = 34
        ws.column_dimensions["C"].width = 18
        ws.column_dimensions["D"].width = 26

        wb.save(EXCEL_FILE)

    return wb, ws


# ── Routes ────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "message": "Bhaala Portfolio API is running 🚀"}


@app.post("/api/register-user")
async def register_user(user: RegisteredUser):
    """Save a new registered user's details to the Excel sheet."""
    try:
        wb, ws = get_or_create_workbook()

        # Check for duplicate email (skip header row 1)
        for row in ws.iter_rows(min_row=2, values_only=True):
            if row[1] and str(row[1]).lower() == user.email.lower():
                # Already saved — not an error, just skip silently
                return {"success": True, "message": "User already in records."}

        # Append new row
        registered_at = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        ws.append([user.name, user.email, user.phone, registered_at])
        wb.save(EXCEL_FILE)

        print(f"✅ Saved to Excel: {user.name} ({user.email})")
        return {"success": True, "message": f"User {user.name} saved to Excel."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/contact")
async def contact(form: ContactForm):
    """Save a contact form submission to Supabase."""
    try:
        if not supabase_admin:
            raise HTTPException(status_code=503, detail="Supabase not configured on backend.")

        result = supabase_admin.table("contacts").insert({
            "name":    form.name,
            "email":   form.email,
            "message": form.message,
        }).execute()

        if result.data:
            return {"success": True, "message": "Message received! I'll get back to you soon."}
        raise HTTPException(status_code=500, detail="Failed to save contact form.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
