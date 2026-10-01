/**
 * BSVS Public Application Endpoint
 *
 * SETUP:
 * 1. Create/open the Google Sheet that will store applications.
 * 2. Put its Spreadsheet ID in SPREADSHEET_ID.
 * 3. Put both notification email addresses in RECIPIENTS.
 * 4. Deploy as a Web app, Execute as: Me, access: Anyone.
 * 5. Copy the /exec URL into js/apply.js.
 */

const SPREADSHEET_ID = "1zOvkimO4lMPos539WzOafAOnDC3yRcWx-0WtyEYUUMA";
const SHEET_NAME = "Applications";

const RECIPIENTS = [
  "bsvsinternships@gmail.com",
  "bsvstutorials@gmail.com"
];

function doGet() {
  return output_({
    ok: true,
    service: "BSVS Application Endpoint",
    status: "online"
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const raw = e && e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    // Basic anti-bot honeypot.
    if (data.website) {
      return output_({ ok: false, message: "Rejected" });
    }

    const type = data.applicationType === "course" ? "course" : "internship";
    const name = String(data.fullName || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.phone || "").trim();

    if (!name || !email || !phone) {
      return output_({ ok: false, message: "Missing required fields" });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return output_({ ok: false, message: "Invalid phone number" });
    }

    const sheet = getOrCreateSheet_();

    const submissionId = String(data.submissionId || Utilities.getUuid()).trim();
    const receivedAt = new Date();

    sheet.appendRow([
      receivedAt,
      submissionId,
      type,
      name,
      email,
      phone,
      String(data.college || "").trim(),
      String(data.branch || "").trim(),
      String(data.level || "").trim(),
      String(data.domain || "").trim(),
      String(data.currentCourse || "").trim(),
      String(data.courseChoice || "").trim(),
      String(data.learningMode || "").trim(),
      String(data.message || "").trim(),
      "New"
    ]);

    const subject = type === "course"
      ? "New BSVS Course Enquiry Received"
      : "New BSVS Internship Application Received";

    const body = [
      "A new enquiry/application has been submitted through the official BSVS website.",
      "",
      `Submission ID: ${submissionId}`,
      `Type: ${type === "course" ? "Course Enquiry" : "Internship Application"}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `College / Institution: ${String(data.college || "-").trim()}`,
      `Branch: ${String(data.branch || "-").trim()}`,
      `Academic Level: ${String(data.level || "-").trim()}`,
      `Internship Domain: ${String(data.domain || "-").trim()}`,
      `Current Course: ${String(data.currentCourse || "-").trim()}`,
      `Preferred BSVS Course: ${String(data.courseChoice || "-").trim()}`,
      `Learning Mode: ${String(data.learningMode || "-").trim()}`,
      `Message: ${String(data.message || "-").trim()}`,
      "",
      `Received: ${receivedAt.toLocaleString()}`
    ].join("\n");

    const recipients = RECIPIENTS
      .map((value) => String(value || "").trim())
      .filter((value) => value && value.includes("@"));

    if (recipients.length === 0) {
      throw new Error("No valid notification recipient configured.");
    }

    MailApp.sendEmail({
      to: recipients.join(","),
      subject,
      body,
      replyTo: email,
      name: "BSVS"
    });

    return output_({
      ok: true,
      submissionId
    });

  } catch (error) {
    console.error(error);
    return output_({
      ok: false,
      message: "Server error"
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {}
  }
}

function getOrCreateSheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID.includes("PASTE_GOOGLE_SHEET_ID_HERE")) {
    throw new Error("SPREADSHEET_ID is not configured.");
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp",
      "Submission ID",
      "Type",
      "Full Name",
      "Email",
      "Phone",
      "College / Institution",
      "Branch",
      "Academic Level",
      "Internship Domain",
      "Current Course",
      "Preferred BSVS Course",
      "Learning Mode",
      "Message",
      "Status"
    ]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function output_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
