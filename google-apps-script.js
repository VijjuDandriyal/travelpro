// ============================================================
// TravelPro - Google Apps Script
// INSTRUCTIONS:
// 1. Open your Google Sheet
// 2. Click Extensions → Apps Script
// 3. Delete existing code
// 4. Paste ALL of this code
// 5. Click Save (Ctrl+S)
// 6. Click Deploy → New Deployment → Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 7. Copy the Web App URL and paste in index.html
// ============================================================

const SHEET_NAME   = "Sheet1";           // ← Your sheet tab name
const NOTIFY_EMAIL = "your@email.com";   // ← Your email address

// ── Handle POST requests from the form ──────────────────────
function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp","Full Name","Email","Phone",
        "Role","Referral Code","Status"
      ]);
    }

    // Save registration data
    sheet.appendRow([
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.name     || "",
      data.email    || "",
      data.phone    || "",
      data.role     || "Traveler",
      data.referral || "",
      "New"
    ]);

    // Track referral credit
    if (data.referral) {
      creditReferral(data.referral, data.name, data.email);
    }

    // Send admin notification email
    sendNotificationEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", message: "Saved!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Error: " + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Handle GET requests (health check) ──────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput("TravelPro API is running ✅")
    .setMimeType(ContentService.MimeType.TEXT);
}

// ── Send email notification to admin ────────────────────────
function sendNotificationEmail(data) {
  try {
    const subject = `🌍 New TravelPro Registration: ${data.name} [${data.role}]`;
    const body = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NEW REGISTRATION - TravelPro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name:          ${data.name}
📧 Email:         ${data.email}
📱 Phone:         ${data.phone}
🏷️  Role:          ${data.role}
🔗 Referral Code: ${data.referral || "None"}
🕐 Time:          ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
View all registrations in Google Sheets:
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
  } catch (err) {
    Logger.log("Email error: " + err.toString());
  }
}

// ── Track referral credit in Referral Tracker sheet ─────────
function creditReferral(referralCode, referredName, referredEmail) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let refSheet = ss.getSheetByName("Referral Tracker");

    // Create Referral Tracker sheet if it doesn't exist
    if (!refSheet) {
      refSheet = ss.insertSheet("Referral Tracker");
      refSheet.appendRow([
        "Referral Code","Owner Name","Owner Email",
        "Total Referrals","Total Earned (₹)","Last Referral Date"
      ]);
    }

    const data = refSheet.getDataRange().getValues();
    let found = false;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === referralCode) {
        const newCount   = (data[i][3] || 0) + 1;
        const newEarning = (data[i][4] || 0) + 500;
        refSheet.getRange(i + 1, 4).setValue(newCount);
        refSheet.getRange(i + 1, 5).setValue(newEarning);
        refSheet.getRange(i + 1, 6).setValue(new Date().toLocaleString());
        found = true;
        break;
      }
    }

    // Auto-create entry if referral code not found yet
    if (!found) {
      refSheet.appendRow([
        referralCode, "Unknown", "", 1, 500,
        new Date().toLocaleString()
      ]);
    }
  } catch (err) {
    Logger.log("Referral tracking error: " + err.toString());
  }
}

// ── Generate a unique referral code for a user ──────────────
function generateReferralCode(name) {
  const prefix = name.replace(/\s+/g, "").toUpperCase().substring(0, 4);
  const rand   = Math.floor(1000 + Math.random() * 9000);
  return prefix + rand; // e.g., JOHN4821
}

// ── Manual test function (run from Apps Script editor) ───────
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name:     "Test User",
        email:    "test@example.com",
        phone:    "+91 9876543210",
        role:     "Travel Agent",
        referral: "TEST123"
      })
    }
  };
  const result = doPost(testData);
  Logger.log(result.getContent());
}
