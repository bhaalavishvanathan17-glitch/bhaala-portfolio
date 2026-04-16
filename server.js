const express = require('express');
const cors = require('cors');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const EXCEL_FILE = path.join(__dirname, 'users.xlsx');

// Column positions (1-indexed) — MUST match the header order below
const COL = { NAME: 1, EMAIL: 2, PASSWORD: 3, PHONE: 4, REGISTERED_AT: 5 };
const HEADERS = ['Full Name', 'Email', 'Password', 'Phone', 'Registered At'];

app.use(cors());
app.use(express.json());

// Redirect root → login page
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.use(express.static(__dirname));

// ─────────────────────────────────────────────
// Helper: get or create workbook + worksheet
// ─────────────────────────────────────────────
async function getWorkbook() {
    const wb = new ExcelJS.Workbook();

    if (fs.existsSync(EXCEL_FILE)) {
        await wb.xlsx.readFile(EXCEL_FILE);
    }

    let ws = wb.getWorksheet('Users');

    if (!ws) {
        ws = wb.addWorksheet('Users');

        // Write header row using array (no key reliance)
        const headerRow = ws.addRow(HEADERS);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF6C0B0B' }
        };
        headerRow.alignment = { horizontal: 'center' };

        // Set column widths
        ws.getColumn(COL.NAME).width         = 25;
        ws.getColumn(COL.EMAIL).width        = 32;
        ws.getColumn(COL.PASSWORD).width     = 20;
        ws.getColumn(COL.PHONE).width        = 18;
        ws.getColumn(COL.REGISTERED_AT).width = 26;

        await wb.xlsx.writeFile(EXCEL_FILE);
    }

    return { wb, ws };
}

// ─────────────────────────────────────────────
// POST /register
// ─────────────────────────────────────────────
app.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const { wb, ws } = await getWorkbook();

        // Check if email already exists (skip header row 1)
        let emailExists = false;
        ws.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const cellVal = row.getCell(COL.EMAIL).value;
            if (cellVal && cellVal.toString().toLowerCase() === email.toLowerCase()) {
                emailExists = true;
            }
        });

        if (emailExists) {
            return res.status(409).json({ success: false, message: 'Email already registered. Please login.' });
        }

        // Add new row using array — reliable regardless of key mapping
        ws.addRow([
            name,
            email,
            password,
            phone,
            new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        ]);

        await wb.xlsx.writeFile(EXCEL_FILE);
        console.log(`✅ Registered: ${name} (${email})`);
        return res.json({ success: true, message: 'Registration successful! You can now login.' });

    } catch (err) {
        console.error('Register error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
    }
});

// ─────────────────────────────────────────────
// POST /login
// ─────────────────────────────────────────────
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    if (!fs.existsSync(EXCEL_FILE)) {
        return res.status(401).json({ success: false, message: 'No users found. Please register first.' });
    }

    try {
        const { ws } = await getWorkbook();
        let found = false;
        let userName = '';

        ws.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            const storedEmail    = (row.getCell(COL.EMAIL).value    || '').toString().toLowerCase();
            const storedPassword = (row.getCell(COL.PASSWORD).value || '').toString();
            const storedName     = (row.getCell(COL.NAME).value     || '').toString();

            if (storedEmail === email.toLowerCase() && storedPassword === password) {
                found = true;
                userName = storedName;
            }
        });

        if (found) {
            console.log(`✅ Login: ${userName} (${email})`);
            return res.json({ success: true, message: `Welcome back, ${userName}!`, name: userName });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

    } catch (err) {
        console.error('Login error:', err.message);
        return res.status(500).json({ success: false, message: 'Server error during login. Please try again.' });
    }
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║   BHAALA Portfolio — Server Running      ║');
    console.log(`║   http://localhost:${PORT}                   ║`);
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
});
