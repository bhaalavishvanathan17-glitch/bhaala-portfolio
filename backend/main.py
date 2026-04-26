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

# ── CORS ── allow all origins so phones/tablets on same WiFi work ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Excel file paths ───────────────────────────
USERS_FILE    = Path(__file__).parent / "registered_users.xlsx"
MESSAGES_FILE = Path(__file__).parent / "messages.xlsx"

DARK_RED = PatternFill("solid", fgColor="6C0B0B")
HDR_FONT = Font(bold=True, color="FFFFFF", size=12)
CENTER   = Alignment(horizontal="center")


def _make_styled_sheet(wb, title: str, headers: list, col_widths: list):
    ws = wb.active
    ws.title = title
    for col, h in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col, value=h)
        cell.font      = HDR_FONT
        cell.fill      = DARK_RED
        cell.alignment = CENTER
    for i, w in enumerate(col_widths, start=1):
        ws.column_dimensions[ws.cell(row=1, column=i).column_letter].width = w
    return ws


def get_users_wb():
    """Return (workbook, worksheet) for registered_users.xlsx."""
    if USERS_FILE.exists():
        wb = openpyxl.load_workbook(USERS_FILE)
        return wb, wb.active
    wb = openpyxl.Workbook()
    _make_styled_sheet(wb, "Registered Users",
                       ["Full Name", "Email", "Phone", "Registered At"],
                       [26, 34, 18, 26])
    wb.save(USERS_FILE)
    return wb, wb.active


def get_messages_wb():
    """Return (workbook, worksheet) for messages.xlsx."""
    if MESSAGES_FILE.exists():
        wb = openpyxl.load_workbook(MESSAGES_FILE)
        return wb, wb.active
    wb = openpyxl.Workbook()
    _make_styled_sheet(wb, "Contact Messages",
                       ["Full Name", "Email", "Message", "Received At"],
                       [24, 34, 60, 26])
    wb.save(MESSAGES_FILE)
    return wb, wb.active


# ── Routes ────────────────────────────────────

@app.get("/")
def root():
    return {
        "app": "Bhaala Portfolio API",
        "status": "running ✅",
        "version": "1.0.0",
        "endpoints": {
            "health":        "GET  /api/health",
            "register_user": "POST /api/register-user",
            "contact":       "POST /api/contact",
        },
        "frontend": "http://localhost:5173",
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "message": "Bhaala Portfolio API is running 🚀"}


@app.post("/api/register-user")
async def register_user(user: RegisteredUser):
    """Save a new registered user's details to registered_users.xlsx."""
    try:
        wb, ws = get_users_wb()
        for row in ws.iter_rows(min_row=2, values_only=True):
            if row[1] and str(row[1]).lower() == user.email.lower():
                return {"success": True, "message": "User already in records."}
        ws.append([user.name, user.email, user.phone,
                   datetime.now().strftime("%d-%m-%Y %H:%M:%S")])
        wb.save(USERS_FILE)
        print(f"✅ User saved: {user.name} ({user.email})")
        return {"success": True, "message": f"User {user.name} saved."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/contact")
async def contact(form: ContactForm):
    """Save contact message to messages.xlsx AND Supabase (if configured)."""
    now = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    saved_excel = False
    saved_supabase = False

    # 1. Always save to Excel locally
    try:
        wb, ws = get_messages_wb()
        ws.append([form.name, form.email, form.message, now])
        wb.save(MESSAGES_FILE)
        saved_excel = True
        print(f"✅ Message saved to Excel: {form.name} ({form.email})")
    except Exception as e:
        print(f"⚠️  Excel save failed: {e}")

    # 2. Also save to Supabase if backend is configured
    if supabase_admin:
        try:
            result = supabase_admin.table("contacts").insert({
                "name":    form.name,
                "email":   form.email,
                "message": form.message,
            }).execute()
            saved_supabase = bool(result.data)
        except Exception as e:
            print(f"⚠️  Supabase save failed: {e}")

    if saved_excel or saved_supabase:
        return {"success": True, "message": "Message received! I'll get back to you soon. 🙏"}

    raise HTTPException(status_code=500, detail="Failed to save message.")
